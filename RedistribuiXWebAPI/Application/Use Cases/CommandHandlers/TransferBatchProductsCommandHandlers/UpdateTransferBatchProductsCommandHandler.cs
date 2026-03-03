using Application.Use_Cases.Commands.TransferBatchProductsCommands;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.TransferBatchProductsCommandHandlers
{
    public class UpdateTransferBatchProductsCommandHandler : IRequestHandler<UpdateTransferBatchProductsCommand, bool>
    {
        private readonly ITransferBatchProductsRepository repository;
        private readonly IMapper mapper;

        public UpdateTransferBatchProductsCommandHandler(ITransferBatchProductsRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(UpdateTransferBatchProductsCommand request, CancellationToken cancellationToken)
        {
            var transferBatchProducts = await repository.GetByIdAsync(request.TransferBatchProductsId);
            if (transferBatchProducts == null)
                return false;

            mapper.Map(request, transferBatchProducts);
            await repository.UpdateAsync(transferBatchProducts);
            return true;
        }
    }
}
