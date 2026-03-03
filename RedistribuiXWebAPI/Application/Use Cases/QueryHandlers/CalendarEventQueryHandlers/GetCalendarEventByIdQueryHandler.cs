using Application.Use_Cases.Queries.CalendarEventQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using DTOs;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.CalendarEventQueryHandlers
{
    public class GetCalendarEventByIdQueryHandler : IRequestHandler<GetCalendarEventByIdQuery, Result<CalendarEventDto>>
    {
        private readonly ICalendarEventRepository repository;
        private readonly IMapper mapper;

        public GetCalendarEventByIdQueryHandler(ICalendarEventRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<CalendarEventDto>> Handle(GetCalendarEventByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await repository.GetByIdAsync(request.Id);
            if (entity == null)
            {
                return Result<CalendarEventDto>.Failure("Calendar event not found");
            }

            var dto = mapper.Map<CalendarEventDto>(entity);
            return Result<CalendarEventDto>.Success(dto);
        }
    }
}
