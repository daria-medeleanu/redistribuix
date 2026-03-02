using Domain.Enums;

namespace DTOs
{
    public class CalendarEventDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public EventType EventType { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool CourierBlocked { get; set; }
        public decimal DemandMultiplier { get; set; }

        public AffectedLocationType AffectedLocationType { get; set; }
    }
}
