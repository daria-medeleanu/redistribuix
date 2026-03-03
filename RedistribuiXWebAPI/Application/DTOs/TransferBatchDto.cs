using Domain.Enums;

namespace Application.DTOs
{
    public class TransferBatchDto
    {
        public Guid TransferBatchId { get; set; }
        public Guid SourceLocationId { get; set; }
        public Guid DestinationLocationId { get; set; }
        public decimal Cost { get; set; }
        public decimal TotalCost { get; set; }
        public decimal TransferScore { get; set; }
        public StatusTransfer Status { get; set; }
        public string DenialReason { get; set; }
        public DateTime RecommededBySystemAt { get; set; }
        //Aprobat sau respins de catre manager
        public DateTime ApprovedAt { get; set; }
    }
}
