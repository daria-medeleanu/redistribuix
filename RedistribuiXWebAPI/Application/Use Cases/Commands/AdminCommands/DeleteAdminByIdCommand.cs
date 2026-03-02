using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.AdminCommands
{
    public record DeleteAdminByIdCommand(Guid Id) : IRequest<Result<Unit>>;
}
