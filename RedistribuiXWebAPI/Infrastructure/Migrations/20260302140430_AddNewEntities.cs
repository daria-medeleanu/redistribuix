using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNewEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DailySales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
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
                name: "Eveniment_Calendar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    EventType = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CourierBlocked = table.Column<bool>(type: "boolean", nullable: false),
                    DemandMultiplier = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    AffectedLocationType = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Eveniment_Calendar", x => x.Id);
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
                    StockConfidence = table.Column<int>(type: "integer", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_DailySales_LocationId",
                table: "DailySales",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_DailySales_ProductId",
                table: "DailySales",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_StockVelocities_LocationId",
                table: "StockVelocities",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_StockVelocities_ProductId",
                table: "StockVelocities",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailySales");

            migrationBuilder.DropTable(
                name: "Eveniment_Calendar");

            migrationBuilder.DropTable(
                name: "StockVelocities");
        }
    }
}
