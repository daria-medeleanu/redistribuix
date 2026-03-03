using Application.Use_Cases.Commands.CalendarEventCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.CalendarEventCommandHandlers
{
    public class CreateCalendarEventCommandHandler : IRequestHandler<CreateCalendarEventCommand, Result<Guid>>
    {
        private readonly ICalendarEventRepository repository;
        private readonly IMapper mapper;

        public CreateCalendarEventCommandHandler(ICalendarEventRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<Guid>> Handle(CreateCalendarEventCommand request, CancellationToken cancellationToken)
        {
            var entity = mapper.Map<CalendarEvent>(request);

            await repository.AddAsync(entity);

            return Result<Guid>.Success(entity.Id);
        }
    }
}
