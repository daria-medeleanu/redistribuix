using Application.Use_Cases.Queries.CalendarEventQueries;
using AutoMapper;
using Domain.Repositories;
using DTOs;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.CalendarEventQueryHandlers
{
    public class GetAllCalendarEventsQueryHandler : IRequestHandler<GetAllCalendarEventsQuery, List<CalendarEventDto>>
    {
        private readonly ICalendarEventRepository repository;
        private readonly IMapper mapper;

        public GetAllCalendarEventsQueryHandler(ICalendarEventRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<CalendarEventDto>> Handle(GetAllCalendarEventsQuery request, CancellationToken cancellationToken)
        {
            var entities = await repository.GetAllAsync();
            return mapper.Map<List<CalendarEventDto>>(entities);
        }
    }
}
