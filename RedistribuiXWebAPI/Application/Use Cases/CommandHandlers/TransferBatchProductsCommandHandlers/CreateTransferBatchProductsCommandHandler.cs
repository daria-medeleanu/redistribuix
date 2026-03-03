using Application.Use_Cases.Commands.TransferBatchProductsCommands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.TransferBatchProductsCommandHandlers
{
    public class CreateTransferBatchProductsCommandHandler : IRequestHandler<CreateTransferBatchProductsCommand, Guid>
    {
        private readonly ITransferBatchProductsRepository repository;
        private readonly IMapper mapper;

        public CreateTransferBatchProductsCommandHandler(ITransferBatchProductsRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Guid> Handle(CreateTransferBatchProductsCommand request, CancellationToken cancellationToken)
        {
            var transferBatchProducts = mapper.Map<TransferBatchProducts>(request);
            await repository.AddAsync(transferBatchProducts);
            return transferBatchProducts.TransferBatchProductsId;
        }
    }
}
