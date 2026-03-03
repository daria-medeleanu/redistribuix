using Application.Use_Cases.Commands.TransferBatchProductsCommands;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.TransferBatchProductsCommandHandlers
{
    public class DeleteTransferBatchProductsCommandHandler : IRequestHandler<DeleteTransferBatchProductsCommand, bool>
    {
        private readonly ITransferBatchProductsRepository repository;

        public DeleteTransferBatchProductsCommandHandler(ITransferBatchProductsRepository repository)
        {
            this.repository = repository;
        }

        public async Task<bool> Handle(DeleteTransferBatchProductsCommand request, CancellationToken cancellationToken)
        {
            var transferBatchProducts = await repository.GetByIdAsync(request.TransferBatchProductsId);
            if (transferBatchProducts == null)
                return false;

            await repository.DeleteAsync(request.TransferBatchProductsId);
            return true;
        }
    }
}
