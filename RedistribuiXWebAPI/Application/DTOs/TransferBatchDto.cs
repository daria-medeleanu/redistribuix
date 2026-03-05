using Domain.Enums;
using DTOs;

namespace Application.DTOs
{
    public class TransferBatchDto
    {
        public Guid TransferBatchId { get; set; }
        public Guid SourceLocationId { get; set; }
        public Guid DestinationLocationId { get; set; }
        public decimal LogisticCostTotal { get; set; }
        public decimal TotalSaleValue { get; set; }
        public decimal TransferScore { get; set; }
        public StatusTransfer Status { get; set; }
        public string DenialReason { get; set; }
        public DateTime RecommendedBySystemAt { get; set; }
        //Aprobat sau respins de catre manager
        public DateTime? ApprovedAt { get; set; }
        public LocationDto SourceLocation { get; set; }
        public LocationDto DestinationLocation { get; set; }
        public List<TransferBatchProductsDto> Products { get; set; } = new();
    }
}
