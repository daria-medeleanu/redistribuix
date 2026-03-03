using Application.Use_Cases.Commands.TransportCostCommands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.TransportCostCommandHandlers
{
    public class CreateTransportCostCommandHandler : IRequestHandler<CreateTransportCostCommand, Guid>
    {
        private readonly ITransportCostRepository repository;
        private readonly IMapper mapper;

        public CreateTransportCostCommandHandler(ITransportCostRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Guid> Handle(CreateTransportCostCommand request, CancellationToken cancellationToken)
        {
            var transportCost = mapper.Map<TransportCost>(request);
            await repository.AddAsync(transportCost);
            return transportCost.TransportCostId;
        }
    }
}
