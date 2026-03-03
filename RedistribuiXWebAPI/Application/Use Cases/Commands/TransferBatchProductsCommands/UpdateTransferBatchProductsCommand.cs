using MediatR;

namespace Application.Use_Cases.Commands.TransferBatchProductsCommands
{
    public class UpdateTransferBatchProductsCommand : IRequest<bool>
    {
        public required Guid TransferBatchProductsId { get; set; }
        public required Guid TransferBatchId { get; set; }
        public required Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
