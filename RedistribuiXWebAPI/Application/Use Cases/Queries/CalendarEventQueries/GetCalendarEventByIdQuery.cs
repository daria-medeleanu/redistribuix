using Domain.Common;
using DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.CalendarEventQueries
{
    public class GetCalendarEventByIdQuery : IRequest<Result<CalendarEventDto>>
    {
        public int Id { get; set; }
    }
}
