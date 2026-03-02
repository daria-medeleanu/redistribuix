using Domain.Enums;
using System;

namespace Domain.Entities
{
    public class StockVelocity
    {
        public Guid Id { get; set; }

        public Guid LocationId { get; set; }
        public Location Location { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        public int CurrentQuantity { get; set; }
        public int SalesLast30Days { get; set; }
        public int SalesLast100Days { get; set; }

        public DateTime LastInboundDate { get; set; }
        public DateTime LastInventoryDate { get; set; }

        public decimal RemainingStockDays { get; set; }
        public StockConfidence StockConfidence { get; set; }

        public StockVelocity()
        {
            Id = Guid.NewGuid();
        }
    }
}
