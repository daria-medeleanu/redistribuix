using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.StandManagerCommands
{
    public record DeleteStandManagerByIdCommand(Guid Id) : IRequest<Result<Unit>>;
}
