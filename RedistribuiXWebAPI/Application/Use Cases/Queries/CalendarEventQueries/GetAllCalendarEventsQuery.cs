using DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.CalendarEventQueries
{
    public class GetAllCalendarEventsQuery : IRequest<List<CalendarEventDto>>
    {
    }
}
