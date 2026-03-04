using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Infrastructure.Persistence
{
    public static class ModelBuilderExtensions
    {
        // Funcție helper pentru a genera GUID-uri fixe și predictibile
        private static Guid GetGuid(int id) => new Guid($"00000000-0000-0000-0000-{id:D12}");

        public static void Seed(this ModelBuilder modelBuilder)
        {
            // 1. ADMIN
            modelBuilder.Entity<Admin>().HasData(
                new { Id = GetGuid(999), Name = "Super Admin ML", Email = "admin@redistribux.com", PasswordHash = "hashed_pw" }
            );

            // Definim ID-urile locațiilor separat pentru a le refolosi
            var locIds = new[] { GetGuid(1), GetGuid(2), GetGuid(3), GetGuid(4), GetGuid(5) };

            // 2. LOCAȚII (adaptate la noul tău enum de profiluri)
            modelBuilder.Entity<Location>().HasData(
                new { LocationId = locIds[0], Name = "Palas Mall", Profile = ProfileType.Mixed, PurchasingPower = PurchasingPower.Premium },
                new { LocationId = locIds[1], Name = "Campus Universitar", Profile = ProfileType.University, PurchasingPower = PurchasingPower.Budget },
                new { LocationId = locIds[2], Name = "Aeroport Otopeni", Profile = ProfileType.Transit, PurchasingPower = PurchasingPower.Premium },
                new { LocationId = locIds[3], Name = "Centru Istoric", Profile = ProfileType.Touristic, PurchasingPower = PurchasingPower.Medium },
                new { LocationId = locIds[4], Name = "Gara de Nord", Profile = ProfileType.Transit, PurchasingPower = PurchasingPower.Budget }
            );

            // 3. STAND MANAGERS
            var managers = new List<object>();
            for (int i = 0; i < 5; i++)
            {
                managers.Add(new
                {
                    Id = GetGuid(100 + i),
                    LocationId = locIds[i],
                    Name = $"Manager Locatia {i + 1}",
                    Email = $"manager{i + 1}@redistribux.com",
                    PasswordHash = "hashed_pw"
                });
            }
            modelBuilder.Entity<StandManager>().HasData(managers);

            // 4. MODELE DE TELEFOANE
            var phoneIds = new[] { GetGuid(201), GetGuid(202), GetGuid(203) };
            modelBuilder.Entity<PhoneModel>().HasData(
                new { ModelId = phoneIds[0], ModelName = "iPhone 15 Pro", LifeStatus = LifeStatus.New, ReleaseDate = new DateTime(2023, 9, 15, 0, 0, 0, DateTimeKind.Utc) },
                new { ModelId = phoneIds[1], ModelName = "Samsung Galaxy S24", LifeStatus = LifeStatus.New, ReleaseDate = new DateTime(2024, 1, 30, 0, 0, 0, DateTimeKind.Utc) },
                new { ModelId = phoneIds[2], ModelName = "iPhone 12", LifeStatus = LifeStatus.Declining, ReleaseDate = new DateTime(2020, 10, 23, 0, 0, 0, DateTimeKind.Utc) }
            );

            // 5. PRODUSE
            var productIds = new List<Guid>();
            for (int i = 0; i < 10; i++) productIds.Add(GetGuid(301 + i));

            modelBuilder.Entity<Product>().HasData(
                new { ProductId = productIds[0], Sku = "IP15-CS-BLK", Name = "Husa Negru IP15", Category = ProductCategory.Case, PhoneModelId = (Guid?)phoneIds[0], PurchasePrice = 10m, SalePrice = 50m },
                new { ProductId = productIds[1], Sku = "IP15-GL-PRO", Name = "Sticla IP15 Pro", Category = ProductCategory.ScreenProtector, PhoneModelId = (Guid?)phoneIds[0], PurchasePrice = 5m, SalePrice = 35m },
                new { ProductId = productIds[2], Sku = "S24-CS-TRN", Name = "Husa Transparenta S24", Category = ProductCategory.Case, PhoneModelId = (Guid?)phoneIds[1], PurchasePrice = 8m, SalePrice = 45m },
                new { ProductId = productIds[3], Sku = "S24-GL-PRV", Name = "Sticla Privacy S24", Category = ProductCategory.ScreenProtector, PhoneModelId = (Guid?)phoneIds[1], PurchasePrice = 7m, SalePrice = 40m },
                new { ProductId = productIds[4], Sku = "IP12-CS-RED", Name = "Husa Rosie IP12", Category = ProductCategory.Case, PhoneModelId = (Guid?)phoneIds[2], PurchasePrice = 4m, SalePrice = 20m },
                new { ProductId = productIds[5], Sku = "CBL-USBC-1M", Name = "Cablu USB-C 1M", Category = ProductCategory.Cable, PhoneModelId = (Guid?)null, PurchasePrice = 6m, SalePrice = 25m },
                new { ProductId = productIds[6], Sku = "CBL-LTN-2M", Name = "Cablu Lightning 2M", Category = ProductCategory.Cable, PhoneModelId = (Guid?)null, PurchasePrice = 8m, SalePrice = 30m },
                new { ProductId = productIds[7], Sku = "CHG-20W-PD", Name = "Incarcator Fast 20W", Category = ProductCategory.Charger, PhoneModelId = (Guid?)null, PurchasePrice = 15m, SalePrice = 65m },
                new { ProductId = productIds[8], Sku = "CHG-CAR-DUAL", Name = "Incarcator Auto Dual", Category = ProductCategory.Charger, PhoneModelId = (Guid?)null, PurchasePrice = 12m, SalePrice = 45m },
                new { ProductId = productIds[9], Sku = "IP15-CS-LTH", Name = "Husa Piele IP15", Category = ProductCategory.Case, PhoneModelId = (Guid?)phoneIds[0], PurchasePrice = 25m, SalePrice = 120m }
            );

            // 6. MATRICEA DE COSTURI DE TRANSPORT
            var transportCosts = new List<object>();
            int tcId = 400;
            var random = new Random(42);

            foreach (var srcId in locIds)
            {
                foreach (var destId in locIds)
                {
                    if (srcId != destId)
                    {
                        transportCosts.Add(new
                        {
                            TransportCostId = GetGuid(tcId++),
                            SourceLocationId = srcId,
                            DestinationLocationId = destId,
                            Cost = (decimal)random.Next(15, 60)
                        });
                    }
                }
            }
            modelBuilder.Entity<TransportCost>().HasData(transportCosts);

            // 7. STOCK VELOCITY & 8. DAILY SALES (REDUS LA 60 DE ZILE pt viteza)
            var stockVelocities = new List<object>();
            var dailySales = new List<object>();

            int svId = 500;
            int dsId = 1;
            DateTime today = DateTime.UtcNow.Date;

            foreach (var locId in locIds)
            {
                foreach (var prodId in productIds)
                {
                    int totalSales30Days = 0;
                    int totalSales60Days = 0; // Folosim 60 in loc de 100 pt viteza

                    // Generăm vânzări pentru 60 de zile!
                    for (int day = 60; day >= 1; day--)
                    {
                        int qtySold = random.Next(0, 5);

                        // Mici boost-uri in functie de zi pentru diversitate
                        if (today.AddDays(-day).DayOfWeek == DayOfWeek.Saturday) qtySold += 1;

                        if (day <= 30) totalSales30Days += qtySold;
                        totalSales60Days += qtySold;

                        dailySales.Add(new
                        {
                            Id = GetGuid(20000 + dsId++),
                            LocationId = locId,
                            ProductId = prodId,
                            SaleDate = today.AddDays(-day),
                            QuantitySold = qtySold
                        });
                    }

                    int currentQty = random.Next(10, 200);
                    decimal velocity = totalSales30Days > 0 ? (decimal)totalSales30Days / 30m : 0.1m;

                    stockVelocities.Add(new
                    {
                        Id = GetGuid(svId++),
                        LocationId = locId,
                        ProductId = prodId,
                        CurrentQuantity = currentQty,
                        SalesLast30Days = totalSales30Days,
                        SalesLast100Days = totalSales60Days, // Am pus totalul de 60 aici
                        LastInboundDate = today.AddDays(-random.Next(2, 20)),
                        LastInventoryDate = today.AddDays(-1),
                        RemainingStockDays = Math.Round(currentQty / velocity, 2),
                        StockConfidence = StockConfidence.Medium
                    });
                }
            }

            modelBuilder.Entity<StockVelocity>().HasData(stockVelocities);
            modelBuilder.Entity<DailySale>().HasData(dailySales);

            // 9. EVENIMENTE CALENDAR (Adaptate să pice în ultimele 60 de zile pt a fi relevante la teste)
            modelBuilder.Entity<CalendarEvent>().HasData(
                new { Id = GetGuid(8001), Name = "Start An Universitar", EventType = EventType.Promotion, StartDate = today.AddDays(-40), EndDate = today.AddDays(-30), DemandMultiplier = 2.5m, AffectedLocationType = AffectedLocationType.Universitary },
                new { Id = GetGuid(8002), Name = "Flash Sale", EventType = EventType.Promotion, StartDate = today.AddDays(-15), EndDate = today.AddDays(-10), DemandMultiplier = 4.0m, AffectedLocationType = AffectedLocationType.All },
                new { Id = GetGuid(8003), Name = "Lansare Nou", EventType = EventType.PhoneLaunch, StartDate = today.AddDays(-55), EndDate = today.AddDays(-45), DemandMultiplier = 3.0m, AffectedLocationType = AffectedLocationType.Mixed },
                new { Id = GetGuid(8004), Name = "Săptămâna Liberă", EventType = EventType.Vacation, StartDate = today.AddDays(-25), EndDate = today.AddDays(-20), DemandMultiplier = 0.5m, AffectedLocationType = AffectedLocationType.Universitary },
                new { Id = GetGuid(8005), Name = "Weekend Turistic", EventType = EventType.TouristSeason, StartDate = today.AddDays(-5), EndDate = today.AddDays(-2), DemandMultiplier = 3.0m, AffectedLocationType = AffectedLocationType.Transit }
            );

            // 10. TRANSFER BATCHES (Istoric de 10 de transferuri pt viteza)
            var transferBatches = new List<object>();
            var transferBatchProducts = new List<object>();
            int tbpId = 1;

            for (int i = 0; i < 10; i++)
            {
                var batchId = GetGuid(9000 + i);
                var srcIdx = random.Next(0, 5);
                var destIdx = random.Next(0, 5);
                while (srcIdx == destIdx) destIdx = random.Next(0, 5);

                var status = i % 5 == 0 ? StatusTransfer.Rejected : StatusTransfer.Completed;
                decimal score = random.Next(60, 99) + (decimal)random.NextDouble();

                transferBatches.Add(new
                {
                    TransferBatchId = batchId,
                    SourceLocationId = locIds[srcIdx],
                    DestinationLocationId = locIds[destIdx],
                    LogisticCostTotal = (decimal)random.Next(15, 45),
                    TotalSaleValue = (decimal)random.Next(200, 1500),
                    TransferScore = Math.Round(score, 2),
                    Status = status,
                    RecommendedBySystemAt = today.AddDays(-random.Next(5, 55)), // Adaptat la istoric 60 zile
                    ApprovedAt = status == StatusTransfer.Completed ? (DateTime?)today.AddDays(-random.Next(1, 4)) : null,
                    DenialReason = status == StatusTransfer.Rejected ? "Lipsă personal" : null
                });

                int numProductsInBatch = random.Next(1, 4);
                for (int j = 0; j < numProductsInBatch; j++)
                {
                    transferBatchProducts.Add(new
                    {
                        TransferBatchProductsId = GetGuid(9500 + tbpId++),
                        TransferBatchId = batchId,
                        ProductId = productIds[random.Next(0, 10)],
                        Quantity = random.Next(2, 20)
                    });
                }
            }

            modelBuilder.Entity<TransferBatch>().HasData(transferBatches);
            modelBuilder.Entity<TransferBatchProducts>().HasData(transferBatchProducts);
        }
    }
}