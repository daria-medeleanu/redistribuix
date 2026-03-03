using Application.DTOs;
using Application.Use_Cases.Queries.TransportCostQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.TransportCostQueryHandlers
{
    public class GetAllTransportCostsQueryHandler : IRequestHandler<GetAllTransportCostsQuery, List<TransportCostDto>>
    {
        private readonly ITransportCostRepository transportCostRepository;
        private readonly IMapper mapper;

        public GetAllTransportCostsQueryHandler(ITransportCostRepository transportCostRepository, IMapper mapper)
        {
            this.transportCostRepository = transportCostRepository;
            this.mapper = mapper;
        }

        public async Task<List<TransportCostDto>> Handle(GetAllTransportCostsQuery request, CancellationToken cancellationToken)
        {
            var transportCosts = await transportCostRepository.GetAllAsync();
            return mapper.Map<List<TransportCostDto>>(transportCosts);
        }
    }
}
