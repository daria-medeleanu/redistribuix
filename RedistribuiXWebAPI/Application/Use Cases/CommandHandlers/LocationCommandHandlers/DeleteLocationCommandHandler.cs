using Application.Use_Cases.Commands.LocationCommands;
using AutoMapper;
using Domain.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.LocationCommandHandlers
{
    public class DeleteLocationCommandHandler : IRequestHandler<DeleteLocationCommand, bool>
    {
        private readonly ILocationRepository repository;
        private readonly IMapper mapper;

        public DeleteLocationCommandHandler(ILocationRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(DeleteLocationCommand request, CancellationToken cancellationToken)
        {
            var location = await repository.GetByIdAsync(request.LocationId);
            if (location == null)
                return false;

            // No mapping needed for delete, but IMapper injected for consistency
            await repository.DeleteAsync(request.LocationId);
            return true;
        }
    }
}
