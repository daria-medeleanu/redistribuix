using Application.Use_Cases.Commands.StockVelocityCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.StockVelocityCommandHandlers
{
    public class CreateStockVelocityCommandHandler : IRequestHandler<CreateStockVelocityCommand, Result<Guid>>
    {
        private readonly IStockVelocityRepository repository;
        private readonly IMapper mapper;

        public CreateStockVelocityCommandHandler(IStockVelocityRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<Guid>> Handle(CreateStockVelocityCommand request, CancellationToken cancellationToken)
        {
            var entity = mapper.Map<StockVelocity>(request);

            entity.RemainingStockDays = CalculateRemainingStockDays(entity.CurrentQuantity, entity.SalesLast100Days);
            entity.StockConfidence = CalculateStockConfidence(entity.LastInventoryDate, DateTime.UtcNow);

            await repository.AddAsync(entity);

            return Result<Guid>.Success(entity.Id);
        }

        private static decimal CalculateRemainingStockDays(int currentQuantity, int salesLast100Days)
        {
            if (salesLast100Days <= 0)
            {
                return 0;
            }

            var dailyAverage = salesLast100Days / 100m;
            if (dailyAverage <= 0)
            {
                return 0;
            }

            return Math.Round(currentQuantity / dailyAverage, 2);
        }

        private static StockConfidence CalculateStockConfidence(DateTime lastInventoryDate, DateTime nowUtc)
        {
            var daysSinceInventory = (nowUtc.Date - lastInventoryDate.Date).TotalDays;

            if (daysSinceInventory < 30)
            {
                return StockConfidence.High;
            }

            if (daysSinceInventory <= 60)
            {
                return StockConfidence.Medium;
            }

            return StockConfidence.Low;
        }
    }
}
