using Application.Use_Cases.Commands.CalendarEventCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.CalendarEventCommandHandlers
{
    public class DeleteCalendarEventByIdCommandHandler : IRequestHandler<DeleteCalendarEventByIdCommand, Result<Unit>>
    {
        private readonly ICalendarEventRepository repository;

        public DeleteCalendarEventByIdCommandHandler(ICalendarEventRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Result<Unit>> Handle(DeleteCalendarEventByIdCommand request, CancellationToken cancellationToken)
        {
            var existing = await repository.GetByIdAsync(request.Id);
            if (existing == null)
            {
                return Result<Unit>.Failure("Calendar event not found.");
            }

            await repository.DeleteAsync(request.Id);
            return Result<Unit>.Success(Unit.Value);
        }
    }
}
