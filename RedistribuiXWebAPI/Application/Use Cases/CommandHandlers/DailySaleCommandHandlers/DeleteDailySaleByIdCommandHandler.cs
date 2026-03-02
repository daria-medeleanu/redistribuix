using Application.Use_Cases.Commands.DailySaleCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.DailySaleCommandHandlers
{
    public class DeleteDailySaleByIdCommandHandler : IRequestHandler<DeleteDailySaleByIdCommand, Result<Unit>>
    {
        private readonly IDailySaleRepository repository;

        public DeleteDailySaleByIdCommandHandler(IDailySaleRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Result<Unit>> Handle(DeleteDailySaleByIdCommand request, CancellationToken cancellationToken)
        {
            var existing = await repository.GetByIdAsync(request.Id);
            if (existing == null)
            {
                return Result<Unit>.Failure("Daily sale not found.");
            }

            await repository.DeleteAsync(request.Id);
            return Result<Unit>.Success(Unit.Value);
        }
    }
}
