using Application.Use_Cases.Commands.LocationCommands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.LocationCommandHandlers
{
    public class CreateLocationCommandHandler : IRequestHandler<CreateLocationCommand, Guid>
    {
        private readonly ILocationRepository repository;
        private readonly IMapper mapper;

        public CreateLocationCommandHandler(ILocationRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Guid> Handle(CreateLocationCommand request, CancellationToken cancellationToken)
        {
            var location = mapper.Map<Location>(request);
            await repository.AddAsync(location);
            return location.LocationId;
        }
    }
}
