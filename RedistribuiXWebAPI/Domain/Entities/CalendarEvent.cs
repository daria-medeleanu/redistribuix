using Domain.Enums;

namespace Domain.Entities
{
    public class CalendarEvent
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public EventType EventType { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal DemandMultiplier { get; set; }

        public AffectedLocationType AffectedLocationType { get; set; }

        public CalendarEvent()
        {
            Id = Guid.NewGuid();
        }
    }
}
