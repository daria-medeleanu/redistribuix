using Application.Use_Cases.Commands.DailySaleCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.DailySaleCommandHandlers
{
    public class UpdateDailySaleCommandHandler : IRequestHandler<UpdateDailySaleCommand, Result<Unit>>
    {
        private readonly IDailySaleRepository repository;

        public UpdateDailySaleCommandHandler(IDailySaleRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Result<Unit>> Handle(UpdateDailySaleCommand request, CancellationToken cancellationToken)
        {
            var existing = await repository.GetByIdAsync(request.Id);
            if (existing == null)
            {
                return Result<Unit>.Failure("Daily sale not found.");
            }

            existing.LocationId = request.LocationId;
            existing.ProductId = request.ProductId;
            existing.SaleDate = request.SaleDate;
            existing.QuantitySold = request.QuantitySold;

            await repository.UpdateAsync(existing);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
