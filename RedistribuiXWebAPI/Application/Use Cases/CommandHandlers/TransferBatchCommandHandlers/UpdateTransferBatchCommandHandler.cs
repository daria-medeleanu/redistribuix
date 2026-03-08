using Application.Use_Cases.Commands.TransferBatchCommands;
using AutoMapper;
using Domain.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.TransferBatchCommandHandlers
{
    public class UpdateTransferBatchCommandHandler : IRequestHandler<UpdateTransferBatchCommand, bool>
    {
        private readonly ITransferBatchRepository repository;
        private readonly IStockVelocityRepository stockVelocityRepository;
        private readonly IMapper mapper;

        public UpdateTransferBatchCommandHandler(
            ITransferBatchRepository repository,
            IStockVelocityRepository stockVelocityRepository,
            IMapper mapper)
        {
            this.repository = repository;
            this.stockVelocityRepository = stockVelocityRepository;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(UpdateTransferBatchCommand request, CancellationToken cancellationToken)
        {
            var transferBatch = await repository.GetByIdAsync(request.TransferBatchId);
            if (transferBatch == null)
                return false;

            var isBeingCompleted = request.Status == StatusTransfer.Completed
                                && transferBatch.Status != StatusTransfer.Completed;

            mapper.Map(request, transferBatch);
            await repository.UpdateAsync(transferBatch);

            if (isBeingCompleted)
            {
                foreach (var item in transferBatch.Products)
                {
                    var sourceStock = await stockVelocityRepository
                        .GetByLocationAndProductAsync(transferBatch.SourceLocationId, item.ProductId);

                    if (sourceStock != null)
                    {
                        sourceStock.CurrentQuantity -= item.Quantity;
                        await stockVelocityRepository.UpdateAsync(sourceStock);
                    }

                    var destinationStock = await stockVelocityRepository
                        .GetByLocationAndProductAsync(transferBatch.DestinationLocationId, item.ProductId);

                    if (destinationStock != null)
                    {
                        destinationStock.CurrentQuantity += item.Quantity;
                        await stockVelocityRepository.UpdateAsync(destinationStock);
                    }
                    else
                    {
                        await stockVelocityRepository.AddAsync(new Domain.Entities.StockVelocity
                        {
                            LocationId = transferBatch.DestinationLocationId,
                            ProductId = item.ProductId,
                            CurrentQuantity = item.Quantity,
                            LastInventoryDate = DateTime.UtcNow,
                            LastInboundDate = DateTime.UtcNow
                        });
                    }
                }
            }

            return true;
        }
    }
}