using Domain.Enums;
using MediatR;

namespace Application.Use_Cases.Commands.TransferBatchCommands
{
    public class UpdateTransferBatchCommand : IRequest<bool>
    {
        public required Guid TransferBatchId { get; set; }
        public required Guid SourceLocationId { get; set; }
        public required Guid DestinationLocationId { get; set; }
        public decimal LogisticCostTotal { get; set; }
        public decimal TotalSaleValue { get; set; }
        public decimal TransferScore { get; set; }
        public StatusTransfer Status { get; set; }
        public string? DenialReason { get; set; }
        public DateTime RecommendedBySystemAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
    }
}
