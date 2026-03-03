using Application.Use_Cases.Commands.TransferBatchCommands;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.TransferBatchCommandHandlers
{
    public class UpdateTransferBatchCommandHandler : IRequestHandler<UpdateTransferBatchCommand, bool>
    {
        private readonly ITransferBatchRepository repository;
        private readonly IMapper mapper;

        public UpdateTransferBatchCommandHandler(ITransferBatchRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(UpdateTransferBatchCommand request, CancellationToken cancellationToken)
        {
            var transferBatch = await repository.GetByIdAsync(request.TransferBatchId);
            if (transferBatch == null)
                return false;

            mapper.Map(request, transferBatch);
            await repository.UpdateAsync(transferBatch);
            return true;
        }
    }
}
