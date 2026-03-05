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

            var byProduct = allStockVelocities.GroupBy(sv => sv.ProductId);

            foreach (var productGroup in byProduct)
            {
                var productId = productGroup.Key;
                var lowStockLocations = new List<StockVelocity>();
                var highStockLocations = new List<StockVelocity>();

                foreach (var sv in productGroup)
                {
                    var forecast100Days = await forecastService
                        .GetSalesForecast100DaysAsync(sv.LocationId, sv.ProductId);

                    if (forecast100Days.DaysOfStockMl < LowStockThreshold)
                        lowStockLocations.Add(sv);
                    else if (forecast100Days.DaysOfStockMl > HighStockThreshold)
                        highStockLocations.Add(sv);
                }

                foreach (var destination in lowStockLocations)
                {
                    foreach (var source in highStockLocations)
                    {
                        var transportCost = await transportCostRepository
                            .GetByLocationsAsync(source.LocationId, destination.LocationId);

                        if (transportCost == null) continue;

                        int quantityToTransfer = CalculateQuantityToTransfer(source);
                        decimal totalSaleValue = quantityToTransfer * source.Product.SalePrice;
                        decimal profit = totalSaleValue - transportCost.Cost;
                        decimal score = CalculateTransferScore(profit, transportCost.Cost);

                        var batchId = Guid.NewGuid();

                        var batch = new TransferBatch
                        {
                            TransferBatchId = batchId,
                            SourceLocationId = source.LocationId,
                            DestinationLocationId = destination.LocationId,
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
                                LocationId = source.Location.LocationId,
                                Name = source.Location.Name,
                                Profile = source.Location.Profile,
                                PurchasingPower = source.Location.PurchasingPower
                            },
                            DestinationLocation = new LocationDto
                            {
                                LocationId = destination.Location.LocationId,
                                Name = destination.Location.Name,
                                Profile = destination.Location.Profile,
                                PurchasingPower = destination.Location.PurchasingPower
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
                    }
                }
            }

            return recommendations;
        }

        private static int CalculateQuantityToTransfer(StockVelocity source)
        {
            int surplus = source.CurrentQuantity / 2;
            return Math.Max(1, surplus);
        }

        private static decimal CalculateTransferScore(decimal profit, decimal cost)
        {
            if (cost == 0) return 0;
            decimal ratio = profit / cost;
            return Math.Min(100, Math.Max(0, Math.Round(ratio * 20, 2)));
        }
    }
}