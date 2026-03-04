using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;

namespace Infrastructure.Persistence
{
    public static class ModelBuilderExtensions
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
            // Generăm niște GUID-uri statice pentru a putea lega tabelele între ele
            var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var location1Id = Guid.Parse("22222222-2222-2222-2222-222222222221");
            var location2Id = Guid.Parse("22222222-2222-2222-2222-222222222222");
            var manager1Id = Guid.Parse("33333333-3333-3333-3333-333333333331");
            var phoneModel1Id = Guid.Parse("44444444-4444-4444-4444-444444444441");
            var phoneModel2Id = Guid.Parse("44444444-4444-4444-4444-444444444442");
            var product1Id = Guid.Parse("55555555-5555-5555-5555-555555555551");
            var product2Id = Guid.Parse("55555555-5555-5555-5555-555555555552");

            // 1. Admins (Obiect anonim)
            modelBuilder.Entity<Admin>().HasData(
                new { Id = adminId, Name = "Super Admin", Email = "admin@redistribux.com", PasswordHash = "hashed_password_here" }
            );

            // 2. Locations (Obiecte anonime)
            modelBuilder.Entity<Location>().HasData(
                new { LocationId = location1Id, Name = "Stand Iulius Mall", Profile = ProfileType.Mixed, PurchasingPower = PurchasingPower.Premium },
                new { LocationId = location2Id, Name = "Stand Universitate", Profile = ProfileType.University, PurchasingPower = PurchasingPower.Budget }
            );

            // 3. Stand Managers
            modelBuilder.Entity<StandManager>().HasData(
                new { Id = manager1Id, Name = "Ion Popescu", Email = "ion@stand1.com", PasswordHash = "hashed_password_here", LocationId = location1Id }
            );

            // 4. Phone Models
            modelBuilder.Entity<PhoneModel>().HasData(
                new { ModelId = phoneModel1Id, ModelName = "iPhone 15 Pro", LifeStatus = LifeStatus.New, ReleaseDate = new DateTime(2023, 9, 15, 0, 0, 0, DateTimeKind.Utc) },
                new { ModelId = phoneModel2Id, ModelName = "Samsung Galaxy S22", LifeStatus = LifeStatus.Declining, ReleaseDate = new DateTime(2022, 2, 25, 0, 0, 0, DateTimeKind.Utc) }
            );

            // 5. Products (Notă: am forțat cast la Guid? pentru a respecta tipul din entitate)
            modelBuilder.Entity<Product>().HasData(
                new { ProductId = product1Id, Sku = "IP15P-CASE-BLK", Name = "Husa Silicon iPhone 15 Pro", Category = ProductCategory.Case, PhoneModelId = (Guid?)phoneModel1Id, PurchasePrice = 15.50m, SalePrice = 89.99m },
                new { ProductId = product2Id, Sku = "SGS22-GLASS-01", Name = "Folie Sticla S22", Category = ProductCategory.ScreenProtector, PhoneModelId = (Guid?)phoneModel2Id, PurchasePrice = 5.00m, SalePrice = 45.00m }
            );

            // 6. Transport Costs
            modelBuilder.Entity<TransportCost>().HasData(
                new { TransportCostId = Guid.Parse("66666666-6666-6666-6666-666666666661"), SourceLocationId = location1Id, DestinationLocationId = location2Id, Cost = 25.00m }
            );

            // 7. Stock Velocities
            modelBuilder.Entity<StockVelocity>().HasData(
                new
                {
                    Id = Guid.Parse("77777777-7777-7777-7777-777777777771"),
                    LocationId = location1Id,
                    ProductId = product1Id,
                    CurrentQuantity = 50,
                    SalesLast30Days = 120,
                    SalesLast100Days = 350,
                    LastInboundDate = DateTime.UtcNow.AddDays(-5),
                    LastInventoryDate = DateTime.UtcNow.AddDays(-1),
                    RemainingStockDays = 12.5m,
                    StockConfidence = StockConfidence.High
                }
            );

            // 8. Calendar Events
            modelBuilder.Entity<CalendarEvent>().HasData(
                        new
                        {
                            Id = Guid.Parse("88888888-8888-8888-8888-888888888881"), // Am schimbat din 1 inapoi in Guid
                            Name = "Black Friday",
                            EventType = EventType.Promotion,
                            StartDate = new DateTime(2024, 11, 29, 0, 0, 0, DateTimeKind.Utc),
                            EndDate = new DateTime(2024, 11, 30, 0, 0, 0, DateTimeKind.Utc),
                            DemandMultiplier = 3.5m,
                            AffectedLocationType = AffectedLocationType.All
                        }
                    );
            // 9. Transfer Batches
            var transferBatch1Id = Guid.Parse("99999999-9999-9999-9999-999999999991");

            modelBuilder.Entity<TransferBatch>().HasData(
                new
                {
                    TransferBatchId = transferBatch1Id,
                    SourceLocationId = location1Id,
                    DestinationLocationId = location2Id,
                    LogisticCostTotal = 25.00m,
                    TotalSaleValue = 449.95m, // (10 * 89.99) pentru huse + (5 * 45.00) pentru folii (valoare estimată)
                    TransferScore = 85.50m, // Un scor mare înseamnă că sistemul recomandă puternic transferul
                    Status = StatusTransfer.Proposed,
                    RecommendedBySystemAt = DateTime.UtcNow.AddHours(-2)
                    // Am omis intenționat 'ApprovedAt' și 'DenialReason' lăsându-le null, deoarece transferul este doar "Propus"
                }
            );

            // 10. Transfer Batch Products (Produsele care fac parte din transferul de mai sus)
            // Notă: Dacă TransferBatchProductsId este de tip 'int' în clasa ta, folosește Id = 1 și Id = 2 în loc de Guid.
            modelBuilder.Entity<TransferBatchProducts>().HasData(
                new
                {
                    TransferBatchProductsId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    TransferBatchId = transferBatch1Id,
                    ProductId = product1Id, // Husa iPhone 15 Pro
                    Quantity = 10
                },
                new
                {
                    TransferBatchProductsId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                    TransferBatchId = transferBatch1Id,
                    ProductId = product2Id, // Folie S22
                    Quantity = 5
                }
            );
        }
    }
}