using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.CalendarEventCommands
{
    public record DeleteCalendarEventByIdCommand(Guid Id) : IRequest<Result<Unit>>;
}
