using Application.Use_Cases.Commands.LocationCommands;
using AutoMapper;
using Domain.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.LocationCommandHandlers
{
    public class UpdateLocationCommandHandler : IRequestHandler<UpdateLocationCommand, bool>
    {
        private readonly ILocationRepository repository;
        private readonly IMapper mapper;

        public UpdateLocationCommandHandler(ILocationRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(UpdateLocationCommand request, CancellationToken cancellationToken)
        {
            var location = await repository.GetByIdAsync(request.LocationId);
            if (location == null)
                return false;

            mapper.Map(request, location);
            await repository.UpdateAsync(location);
            return true;
        }
    }
}
