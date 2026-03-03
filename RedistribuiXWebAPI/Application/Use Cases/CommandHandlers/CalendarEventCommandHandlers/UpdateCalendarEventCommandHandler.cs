using Application.Use_Cases.Commands.CalendarEventCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.CalendarEventCommandHandlers
{
    public class UpdateCalendarEventCommandHandler : IRequestHandler<UpdateCalendarEventCommand, Result<Unit>>
    {
        private readonly ICalendarEventRepository repository;

        public UpdateCalendarEventCommandHandler(ICalendarEventRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Result<Unit>> Handle(UpdateCalendarEventCommand request, CancellationToken cancellationToken)
        {
            var existing = await repository.GetByIdAsync(request.Id);
            if (existing == null)
            {
                return Result<Unit>.Failure("Calendar event not found.");
            }

            existing.Name = request.Name;
            existing.EventType = request.EventType;
            existing.StartDate = request.StartDate;
            existing.EndDate = request.EndDate;
            existing.DemandMultiplier = request.DemandMultiplier;
            existing.AffectedLocationType = request.AffectedLocationType;

            await repository.UpdateAsync(existing);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
