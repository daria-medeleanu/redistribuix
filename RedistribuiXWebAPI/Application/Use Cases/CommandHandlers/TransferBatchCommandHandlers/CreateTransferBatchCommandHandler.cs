using Application.Use_Cases.Commands.TransferBatchCommands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.TransferBatchCommandHandlers
{
    public class CreateTransferBatchCommandHandler : IRequestHandler<CreateTransferBatchCommand, Guid>
    {
        private readonly ITransferBatchRepository repository;
        private readonly IMapper mapper;

        public CreateTransferBatchCommandHandler(ITransferBatchRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Guid> Handle(CreateTransferBatchCommand request, CancellationToken cancellationToken)
        {
            var transferBatch = mapper.Map<TransferBatch>(request);
            await repository.AddAsync(transferBatch);
            return transferBatch.TransferBatchId;
        }
    }
}
