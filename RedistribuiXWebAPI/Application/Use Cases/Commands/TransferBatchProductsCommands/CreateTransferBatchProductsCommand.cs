using MediatR;

namespace Application.Use_Cases.Commands.TransferBatchProductsCommands
{
    public class CreateTransferBatchProductsCommand : IRequest<Guid>
    {
        public required Guid TransferBatchId { get; set; }
        public required Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
