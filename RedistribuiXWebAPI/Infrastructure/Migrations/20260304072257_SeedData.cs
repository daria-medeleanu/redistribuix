using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CalendarEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    EventType = table.Column<string>(type: "text", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DemandMultiplier = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    AffectedLocationType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CalendarEvents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Profile = table.Column<string>(type: "text", nullable: false),
                    PurchasingPower = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.LocationId);
                });

            migrationBuilder.CreateTable(
                name: "PhoneModels",
                columns: table => new
                {
                    ModelId = table.Column<Guid>(type: "uuid", nullable: false),
                    ModelName = table.Column<string>(type: "text", nullable: false),
                    LifeStatus = table.Column<string>(type: "text", nullable: false),
                    ReleaseDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhoneModels", x => x.ModelId);
                });

            migrationBuilder.CreateTable(
                name: "StandManagers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StandManagers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StandManagers_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TransferBatches",
                columns: table => new
                {
                    TransferBatchId = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceLocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    DestinationLocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    LogisticCostTotal = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    TotalSaleValue = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    TransferScore = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    DenialReason = table.Column<string>(type: "text", nullable: true),
                    RecommendedBySystemAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransferBatches", x => x.TransferBatchId);
                    table.ForeignKey(
                        name: "FK_TransferBatches_Locations_DestinationLocationId",
                        column: x => x.DestinationLocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TransferBatches_Locations_SourceLocationId",
                        column: x => x.SourceLocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TransportCosts",
                columns: table => new
                {
                    TransportCostId = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceLocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    DestinationLocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Cost = table.Column<decimal>(type: "numeric(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransportCosts", x => x.TransportCostId);
                    table.ForeignKey(
                        name: "FK_TransportCosts_Locations_DestinationLocationId",
                        column: x => x.DestinationLocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TransportCosts_Locations_SourceLocationId",
                        column: x => x.SourceLocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    Sku = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    PhoneModelId = table.Column<Guid>(type: "uuid", nullable: true),
                    SalePrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    PurchasePrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductId);
                    table.ForeignKey(
                        name: "FK_Products_PhoneModels_PhoneModelId",
                        column: x => x.PhoneModelId,
                        principalTable: "PhoneModels",
                        principalColumn: "ModelId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "DailySales",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    SaleDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    QuantitySold = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailySales", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailySales_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DailySales_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StockVelocities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    CurrentQuantity = table.Column<int>(type: "integer", nullable: false),
                    SalesLast30Days = table.Column<int>(type: "integer", nullable: false),
                    SalesLast100Days = table.Column<int>(type: "integer", nullable: false),
                    LastInboundDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastInventoryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RemainingStockDays = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    StockConfidence = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockVelocities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockVelocities_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StockVelocities_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TransferBatchProducts",
                columns: table => new
                {
                    TransferBatchProductsId = table.Column<Guid>(type: "uuid", nullable: false),
                    TransferBatchId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransferBatchProducts", x => x.TransferBatchProductsId);
                    table.ForeignKey(
                        name: "FK_TransferBatchProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TransferBatchProducts_TransferBatches_TransferBatchId",
                        column: x => x.TransferBatchId,
                        principalTable: "TransferBatches",
                        principalColumn: "TransferBatchId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "Email", "Name", "PasswordHash" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "admin@redistribux.com", "Super Admin", "hashed_password_here" });

            migrationBuilder.InsertData(
                table: "CalendarEvents",
                columns: new[] { "Id", "AffectedLocationType", "DemandMultiplier", "EndDate", "EventType", "Name", "StartDate" },
                values: new object[] { new Guid("88888888-8888-8888-8888-888888888881"), "All", 3.5m, new DateTime(2024, 11, 30, 0, 0, 0, 0, DateTimeKind.Utc), "Promotion", "Black Friday", new DateTime(2024, 11, 29, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.InsertData(
                table: "Locations",
                columns: new[] { "LocationId", "Name", "Profile", "PurchasingPower" },
                values: new object[,]
                {
                    { new Guid("22222222-2222-2222-2222-222222222221"), "Stand Iulius Mall", "Mixed", "Premium" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Stand Universitate", "University", "Budget" }
                });

            migrationBuilder.InsertData(
                table: "PhoneModels",
                columns: new[] { "ModelId", "LifeStatus", "ModelName", "ReleaseDate" },
                values: new object[,]
                {
                    { new Guid("44444444-4444-4444-4444-444444444441"), "New", "iPhone 15 Pro", new DateTime(2023, 9, 15, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("44444444-4444-4444-4444-444444444442"), "Declining", "Samsung Galaxy S22", new DateTime(2022, 2, 25, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "Category", "Name", "PhoneModelId", "PurchasePrice", "SalePrice", "Sku" },
                values: new object[,]
                {
                    { new Guid("55555555-5555-5555-5555-555555555551"), "Case", "Husa Silicon iPhone 15 Pro", new Guid("44444444-4444-4444-4444-444444444441"), 15.50m, 89.99m, "IP15P-CASE-BLK" },
                    { new Guid("55555555-5555-5555-5555-555555555552"), "ScreenProtector", "Folie Sticla S22", new Guid("44444444-4444-4444-4444-444444444442"), 5.00m, 45.00m, "SGS22-GLASS-01" }
                });

            migrationBuilder.InsertData(
                table: "StandManagers",
                columns: new[] { "Id", "Email", "LocationId", "Name", "PasswordHash" },
                values: new object[] { new Guid("33333333-3333-3333-3333-333333333331"), "ion@stand1.com", new Guid("22222222-2222-2222-2222-222222222221"), "Ion Popescu", "hashed_password_here" });

            migrationBuilder.InsertData(
                table: "TransferBatches",
                columns: new[] { "TransferBatchId", "ApprovedAt", "DenialReason", "DestinationLocationId", "LogisticCostTotal", "RecommendedBySystemAt", "SourceLocationId", "Status", "TotalSaleValue", "TransferScore" },
                values: new object[] { new Guid("99999999-9999-9999-9999-999999999991"), null, null, new Guid("22222222-2222-2222-2222-222222222222"), 25.00m, new DateTime(2026, 3, 4, 5, 22, 57, 114, DateTimeKind.Utc).AddTicks(5807), new Guid("22222222-2222-2222-2222-222222222221"), "Proposed", 449.95m, 85.50m });

            migrationBuilder.InsertData(
                table: "TransportCosts",
                columns: new[] { "TransportCostId", "Cost", "DestinationLocationId", "SourceLocationId" },
                values: new object[] { new Guid("66666666-6666-6666-6666-666666666661"), 25.00m, new Guid("22222222-2222-2222-2222-222222222222"), new Guid("22222222-2222-2222-2222-222222222221") });

            migrationBuilder.InsertData(
                table: "StockVelocities",
                columns: new[] { "Id", "CurrentQuantity", "LastInboundDate", "LastInventoryDate", "LocationId", "ProductId", "RemainingStockDays", "SalesLast100Days", "SalesLast30Days", "StockConfidence" },
                values: new object[] { new Guid("77777777-7777-7777-7777-777777777771"), 50, new DateTime(2026, 2, 27, 7, 22, 57, 114, DateTimeKind.Utc).AddTicks(3979), new DateTime(2026, 3, 3, 7, 22, 57, 114, DateTimeKind.Utc).AddTicks(4042), new Guid("22222222-2222-2222-2222-222222222221"), new Guid("55555555-5555-5555-5555-555555555551"), 12.5m, 350, 120, "High" });

            migrationBuilder.InsertData(
                table: "TransferBatchProducts",
                columns: new[] { "TransferBatchProductsId", "ProductId", "Quantity", "TransferBatchId" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), new Guid("55555555-5555-5555-5555-555555555551"), 10, new Guid("99999999-9999-9999-9999-999999999991") },
                    { new Guid("00000000-0000-0000-0000-000000000002"), new Guid("55555555-5555-5555-5555-555555555552"), 5, new Guid("99999999-9999-9999-9999-999999999991") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailySales_LocationId",
                table: "DailySales",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_DailySales_ProductId",
                table: "DailySales",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_PhoneModelId",
                table: "Products",
                column: "PhoneModelId");

            migrationBuilder.CreateIndex(
                name: "IX_StandManagers_LocationId",
                table: "StandManagers",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_StockVelocities_LocationId",
                table: "StockVelocities",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_StockVelocities_ProductId",
                table: "StockVelocities",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_TransferBatches_DestinationLocationId",
                table: "TransferBatches",
                column: "DestinationLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_TransferBatches_SourceLocationId",
                table: "TransferBatches",
                column: "SourceLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_TransferBatchProducts_ProductId",
                table: "TransferBatchProducts",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_TransferBatchProducts_TransferBatchId",
                table: "TransferBatchProducts",
                column: "TransferBatchId");

            migrationBuilder.CreateIndex(
                name: "IX_TransportCosts_DestinationLocationId",
                table: "TransportCosts",
                column: "DestinationLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_TransportCosts_SourceLocationId",
                table: "TransportCosts",
                column: "SourceLocationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "CalendarEvents");

            migrationBuilder.DropTable(
                name: "DailySales");

            migrationBuilder.DropTable(
                name: "StandManagers");

            migrationBuilder.DropTable(
                name: "StockVelocities");

            migrationBuilder.DropTable(
                name: "TransferBatchProducts");

            migrationBuilder.DropTable(
                name: "TransportCosts");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "TransferBatches");

            migrationBuilder.DropTable(
                name: "PhoneModels");

            migrationBuilder.DropTable(
                name: "Locations");
        }
    }
}
