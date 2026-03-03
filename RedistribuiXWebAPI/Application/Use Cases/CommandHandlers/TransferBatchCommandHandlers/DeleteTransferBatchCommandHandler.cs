using Application.Use_Cases.Commands.TransferBatchCommands;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.TransferBatchCommandHandlers
{
    public class DeleteTransferBatchCommandHandler : IRequestHandler<DeleteTransferBatchCommand, bool>
    {
        private readonly ITransferBatchRepository repository;

        public DeleteTransferBatchCommandHandler(ITransferBatchRepository repository)
        {
            this.repository = repository;
        }

        public async Task<bool> Handle(DeleteTransferBatchCommand request, CancellationToken cancellationToken)
        {
            var transferBatch = await repository.GetByIdAsync(request.TransferBatchId);
            if (transferBatch == null)
                return false;

            await repository.DeleteAsync(request.TransferBatchId);
            return true;
        }
    }
}
