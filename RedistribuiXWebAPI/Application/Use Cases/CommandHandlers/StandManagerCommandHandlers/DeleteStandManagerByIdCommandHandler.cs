using Application.Use_Cases.Commands.StandManagerCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.StandManagerCommandHandlers
{
    public class DeleteStandManagerByIdCommandHandler : IRequestHandler<DeleteStandManagerByIdCommand, Result<Unit>>
    {
        private readonly IStandManagerRepository repository;

        public DeleteStandManagerByIdCommandHandler(IStandManagerRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Result<Unit>> Handle(DeleteStandManagerByIdCommand request, CancellationToken cancellationToken)
        {
            var standManager = await repository.GetByIdAsync(request.Id);
            if (standManager == null)
                return Result<Unit>.Failure("StandManager not found.");

            await repository.DeleteAsync(request.Id);
            return Result<Unit>.Success(Unit.Value);
        }
    }
}
