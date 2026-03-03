
using Application.Use_Cases.Commands.TransportCostCommands;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.TransportCostCommandHandlers
{
    public class UpdateTransportCostCommandHandler : IRequestHandler<UpdateTransportCostCommand, bool>
    {
        private readonly ITransportCostRepository repository;
        private readonly IMapper mapper;

        public UpdateTransportCostCommandHandler(ITransportCostRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(UpdateTransportCostCommand request, CancellationToken cancellationToken)
        {
            var transportCost = await repository.GetByIdAsync(request.TransportCostId);
            if (transportCost == null)
                return false;

            mapper.Map(request, transportCost);
            await repository.UpdateAsync(transportCost);
            return true;
        }
    }
}
