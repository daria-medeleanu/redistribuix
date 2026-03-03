using Application.Use_Cases.Commands.StockVelocityCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.StockVelocityCommandHandlers
{
    public class DeleteStockVelocityByIdCommandHandler : IRequestHandler<DeleteStockVelocityByIdCommand, Result<Unit>>
    {
        private readonly IStockVelocityRepository repository;

        public DeleteStockVelocityByIdCommandHandler(IStockVelocityRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Result<Unit>> Handle(DeleteStockVelocityByIdCommand request, CancellationToken cancellationToken)
        {
            var existing = await repository.GetByIdAsync(request.Id);
            if (existing == null)
            {
                return Result<Unit>.Failure("Stock velocity record not found.");
            }

            await repository.DeleteAsync(request.Id);
            return Result<Unit>.Success(Unit.Value);
        }
    }
}
