using Domain.Enums;

namespace Domain.Entities
{
    public class TransferBatch
    {
        public Guid TransferBatchId { get; set; }
        public Guid SourceLocationId { get; set; }
        public Guid DestinationLocationId { get; set; }
        public decimal LogisticCostTotal { get; set; }
        public decimal TotalSaleValue { get; set; }
        public decimal TransferScore { get; set; }
        public StatusTransfer Status { get; set; }
        public string? DenialReason { get; set; }
        public DateTime RecommendedBySystemAt { get; set; }
        public DateTime? ApprovedAt { get; set; }

        public Location SourceLocation { get; set; } = null!;
        public Location DestinationLocation { get; set; } = null!;
        public ICollection<TransferBatchProducts> Products { get; set; } = new List<TransferBatchProducts>();
    }
}
