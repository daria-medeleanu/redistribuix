using Domain.Enums;

namespace DTOs
{
    public class StockVelocityDto
    {
        public Guid Id { get; set; }
        public Guid LocationId { get; set; }
        public Guid ProductId { get; set; }

        public int CurrentQuantity { get; set; }
        public int SalesLast30Days { get; set; }
        public int SalesLast100Days { get; set; }

        public DateTime LastInboundDate { get; set; }
        public DateTime LastInventoryDate { get; set; }

        public decimal RemainingStockDays { get; set; }
        public StockConfidence StockConfidence { get; set; }
    }
}
