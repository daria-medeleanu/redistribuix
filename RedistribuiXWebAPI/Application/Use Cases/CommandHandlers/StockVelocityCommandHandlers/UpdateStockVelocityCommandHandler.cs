using Application.Use_Cases.Commands.StockVelocityCommands;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.StockVelocityCommandHandlers
{
    public class UpdateStockVelocityCommandHandler : IRequestHandler<UpdateStockVelocityCommand, Result<Unit>>
    {
        private readonly IStockVelocityRepository repository;

        public UpdateStockVelocityCommandHandler(IStockVelocityRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Result<Unit>> Handle(UpdateStockVelocityCommand request, CancellationToken cancellationToken)
        {
            var existing = await repository.GetByIdAsync(request.Id);
            if (existing == null)
            {
                return Result<Unit>.Failure("Stock velocity record not found.");
            }

            existing.LocationId = request.LocationId;
            existing.ProductId = request.ProductId;
            existing.CurrentQuantity = request.CurrentQuantity;
            existing.SalesLast30Days = request.SalesLast30Days;
            existing.SalesLast100Days = request.SalesLast100Days;
            existing.LastInboundDate = request.LastInboundDate;
            existing.LastInventoryDate = request.LastInventoryDate;

            existing.RemainingStockDays = CalculateRemainingStockDays(existing.CurrentQuantity, existing.SalesLast100Days);
            existing.StockConfidence = CalculateStockConfidence(existing.LastInventoryDate, DateTime.UtcNow);

            await repository.UpdateAsync(existing);

            return Result<Unit>.Success(Unit.Value);
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
