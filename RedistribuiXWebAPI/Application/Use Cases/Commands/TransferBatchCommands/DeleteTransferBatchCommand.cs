using MediatR;

namespace Application.Use_Cases.Commands.TransferBatchCommands
{
    public class DeleteTransferBatchCommand : IRequest<bool>
    {
        public required Guid TransferBatchId { get; set; }
    }
}
