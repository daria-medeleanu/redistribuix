using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNewEntitiesAndEnumConversions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "TransferBatchProducts");

            migrationBuilder.DropTable(
                name: "TransportCosts");

            migrationBuilder.DropTable(
                name: "TransferBatches");
        }
    }
}
