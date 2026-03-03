using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.DailySaleCommands
{
    public record DeleteDailySaleByIdCommand(Guid Id) : IRequest<Result<Unit>>;
}
