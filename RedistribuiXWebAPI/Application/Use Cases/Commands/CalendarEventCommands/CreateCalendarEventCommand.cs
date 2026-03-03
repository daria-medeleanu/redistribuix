using Domain.Enums;
using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.CalendarEventCommands
{
    public class CreateCalendarEventCommand : IRequest<Result<int>>
    {
        public string Name { get; set; } = string.Empty;
        public EventType EventType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal DemandMultiplier { get; set; }
        public AffectedLocationType AffectedLocationType { get; set; }
    }
}
