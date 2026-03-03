using MediatR;

namespace Application.Use_Cases.Commands.TransferBatchProductsCommands
{
    public class DeleteTransferBatchProductsCommand : IRequest<bool>
    {
        public required Guid TransferBatchProductsId { get; set; }
    }
}
