using Application.DTOs;
using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using DTOs;

namespace Application.Services
{
    public class TransferRecommendationService
    {
        private readonly ISalesForecastService forecastService;
        private readonly IStockVelocityRepository stockVelocityRepository;
        private readonly ITransportCostRepository transportCostRepository;
        private readonly ITransferBatchRepository transferBatchRepository;

        private const int LowStockThreshold = 30; // forecast < 30  → location needs stock
        private const int HighStockThreshold = 60; // forecast > 60  → location has surplus

        public TransferRecommendationService(
            ISalesForecastService forecastService,
            IStockVelocityRepository stockVelocityRepository,
            ITransportCostRepository transportCostRepository,
            ITransferBatchRepository transferBatchRepository)
        {
            this.forecastService = forecastService;
            this.stockVelocityRepository = stockVelocityRepository;
            this.transportCostRepository = transportCostRepository;
            this.transferBatchRepository = transferBatchRepository;
        }

        public async Task<List<TransferBatchDto>> GenerateRecommendationsAsync()
        {
            var allStockVelocities = await stockVelocityRepository.GetAllAsync();
            var recommendations = new List<TransferBatchDto>();

            // Exclude product/source/destination tuples that were already manually approved
            var manuallyApprovedBatches = await transferBatchRepository.GetByStatusAsync(Domain.Enums.StatusTransfer.ManuallyApproved);
            var manuallyApprovedSet = new HashSet<string>(manuallyApprovedBatches
                .SelectMany(tb => tb.Products.Select(p => $"{tb.SourceLocationId}:{tb.DestinationLocationId}:{p.ProductId}")));
            // Also build a set of destination+product pairs that were manually approved so
            // we don't recommend the same product to the same destination from other sources.
            var manuallyApprovedDestProductSet = new HashSet<string>(manuallyApprovedBatches
                .SelectMany(tb => tb.Products.Select(p => $"{tb.DestinationLocationId}:{p.ProductId}")));

            var byProduct = allStockVelocities.GroupBy(sv => sv.ProductId);

            foreach (var productGroup in byProduct)
            {
                var productId = productGroup.Key;

                // păstrăm împreună StockVelocity + forecast ML, ca să putem folosi DaysOfStock şi PredictedDailySales
                var lowStockLocations = new List<(StockVelocity sv, SalesForecastDto forecast)>();
                var highStockLocations = new List<(StockVelocity sv, SalesForecastDto forecast)>();

                foreach (var sv in productGroup)
                {
                    var forecast100Days = await forecastService
                        .GetSalesForecast100DaysAsync(sv.LocationId, sv.ProductId);

                    if (forecast100Days == null)
                    {
                        continue;
                    }

                    if (forecast100Days.DaysOfStockMl < LowStockThreshold)
                        lowStockLocations.Add((sv, forecast100Days));
                    else if (forecast100Days.DaysOfStockMl > HighStockThreshold)
                        highStockLocations.Add((sv, forecast100Days));
                }

                // construim starea pentru destinaţii (câtă nevoie au) şi surse (cât surplus au)
                var destinationStates = lowStockLocations
                    .Select(ld =>
                    {
                        var needDays = LowStockThreshold - ld.forecast.DaysOfStockMl;
                        if (needDays <= 0)
                        {
                            return null;
                        }

                        var needQty = (int)Math.Ceiling(needDays * ld.forecast.PredictedDailySales);

                        return new LocationTransferState
                        {
                            Stock = ld.sv,
                            Forecast = ld.forecast,
                            RemainingQuantity = needQty
                        };
                    })
                    .Where(x => x != null && x.RemainingQuantity > 0)
                    .OrderByDescending(x => x.RemainingQuantity) // cele mai mari nevoi primele
                    .ToList();

                var sourceStates = highStockLocations
                    .Select(sh =>
                    {
                        var surplusDays = sh.forecast.DaysOfStockMl - HighStockThreshold;
                        if (surplusDays <= 0)
                        {
                            return null;
                        }

                        var surplusQty = (int)Math.Floor(surplusDays * sh.forecast.PredictedDailySales);

                        return new LocationTransferState
                        {
                            Stock = sh.sv,
                            Forecast = sh.forecast,
                            RemainingQuantity = surplusQty
                        };
                    })
                    .Where(x => x != null && x.RemainingQuantity > 0)
                    .OrderByDescending(x => x.RemainingQuantity) // cele mai mari surplusuri primele
                    .ToList();

                if (!destinationStates.Any() || !sourceStates.Any())
                {
                    continue;
                }

                // matching: parcurgem destinaţiile (cele mai în nevoie primele)
                // şi le alimentăm din surse (cele mai mari surplusuri) până se epuizează
                var sourceIndex = 0;

                foreach (var destState in destinationStates)
                {
                    // if this destination already has a manually approved transfer for this product, skip
                    var destProductKey = $"{destState.Stock.LocationId}:{productId}";
                    if (manuallyApprovedDestProductSet.Contains(destProductKey))
                    {
                        continue;
                    }
                    while (destState.RemainingQuantity > 0 && sourceIndex < sourceStates.Count)
                    {
                        var sourceState = sourceStates[sourceIndex];

                        if (sourceState.RemainingQuantity <= 0)
                        {
                            sourceIndex++;
                            continue;
                        }

                        var quantityToTransfer = Math.Min(destState.RemainingQuantity, sourceState.RemainingQuantity);

                        if (quantityToTransfer <= 0)
                        {
                            break;
                        }

                        var transportCost = await transportCostRepository
                            .GetByLocationsAsync(sourceState.Stock.LocationId, destState.Stock.LocationId);

                        if (transportCost == null)
                        {
                            // nu există rută între aceste locaţii, trecem la următoarea sursă
                            sourceIndex++;
                            continue;
                        }

                        decimal totalSaleValue = quantityToTransfer * sourceState.Stock.Product.SalePrice;
                        decimal profit = totalSaleValue - transportCost.Cost;
                        decimal score = CalculateTransferScore(profit, transportCost.Cost);

                        var tupleKey = $"{sourceState.Stock.LocationId}:{destState.Stock.LocationId}:{productId}";
                        if (manuallyApprovedSet.Contains(tupleKey))
                        {
                            // There's already a manually approved transfer for this product between these locations.
                            // Skip creating a new recommendation from this source and move to next source.
                            sourceIndex++;
                            continue;
                        }

                        var batchId = Guid.NewGuid();

                        var batch = new TransferBatch
                        {
                            TransferBatchId = batchId,
                            SourceLocationId = sourceState.Stock.LocationId,
                            DestinationLocationId = destState.Stock.LocationId,
                            LogisticCostTotal = transportCost.Cost,
                            TotalSaleValue = totalSaleValue,
                            TransferScore = score,
                            Status = StatusTransfer.Proposed,
                            RecommendedBySystemAt = DateTime.UtcNow,
                            Products = new List<TransferBatchProducts>
                            {
                                new TransferBatchProducts
                                {
                                    TransferBatchProductsId = Guid.NewGuid(),
                                    ProductId = productId,
                                    Quantity = quantityToTransfer
                                }
                            }
                        };

                        await transferBatchRepository.AddAsync(batch);

                        var dto = new TransferBatchDto
                        {
                            TransferBatchId = batch.TransferBatchId,
                            SourceLocationId = batch.SourceLocationId,
                            DestinationLocationId = batch.DestinationLocationId,
                            LogisticCostTotal = batch.LogisticCostTotal,
                            TotalSaleValue = batch.TotalSaleValue,
                            TransferScore = batch.TransferScore,
                            Status = batch.Status,
                            DenialReason = batch.DenialReason,
                            RecommendedBySystemAt = batch.RecommendedBySystemAt,
                            ApprovedAt = batch.ApprovedAt,
                            SourceLocation = new LocationDto
                            {
                                LocationId = sourceState.Stock.Location.LocationId,
                                Name = sourceState.Stock.Location.Name,
                                County = sourceState.Stock.Location.County,
                                Locality = sourceState.Stock.Location.Locality,
                                Profile = sourceState.Stock.Location.Profile,
                                PurchasingPower = sourceState.Stock.Location.PurchasingPower,
                                Latitude = sourceState.Stock.Location.Latitude,
                                Longitude = sourceState.Stock.Location.Longitude
                            },
                            DestinationLocation = new LocationDto
                            {
                                LocationId = destState.Stock.Location.LocationId,
                                Name = destState.Stock.Location.Name,
                                County = destState.Stock.Location.County,
                                Locality = destState.Stock.Location.Locality,
                                Profile = destState.Stock.Location.Profile,
                                PurchasingPower = destState.Stock.Location.PurchasingPower,
                                Latitude = destState.Stock.Location.Latitude,
                                Longitude = destState.Stock.Location.Longitude
                            },
                            Products = batch.Products.Select(p => new TransferBatchProductsDto
                            {
                                TransferBatchProductsId = p.TransferBatchProductsId,
                                TransferBatchId = p.TransferBatchId,
                                ProductId = p.ProductId,
                                Quantity = p.Quantity
                            }).ToList()
                        };

                        recommendations.Add(dto);

                        // actualizăm starea: am consumat din surplusul sursei şi din nevoia destinaţiei
                        destState.RemainingQuantity -= quantityToTransfer;
                        sourceState.RemainingQuantity -= quantityToTransfer;

                        if (sourceState.RemainingQuantity <= 0)
                        {
                            sourceIndex++;
                        }
                    }
                }
            }

            return recommendations;
        }

        private class LocationTransferState
        {
            public StockVelocity Stock { get; set; }
            public SalesForecastDto Forecast { get; set; }
            public int RemainingQuantity { get; set; }
        }

        private static decimal CalculateTransferScore(decimal profit, decimal cost)
        {
            if (cost == 0) return 0;
            decimal ratio = profit / cost;
            return Math.Min(100, Math.Max(0, Math.Round(ratio * 20, 2)));
        }
    }
}