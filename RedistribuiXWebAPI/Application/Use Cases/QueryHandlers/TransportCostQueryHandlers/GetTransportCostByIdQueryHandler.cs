using Application.DTOs;
using Application.Use_Cases.Queries.TransportCostQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.TransportCostQueryHandlers
{
    public class GetTransportCostByIdQueryHandler : IRequestHandler<GetTransportCostByIdQuery, Result<TransportCostDto>>
    {
        private readonly ITransportCostRepository transportCostRepository;
        private readonly IMapper mapper;

        public GetTransportCostByIdQueryHandler(ITransportCostRepository transportCostRepository, IMapper mapper)
        {
            this.transportCostRepository = transportCostRepository;
            this.mapper = mapper;
        }

        public async Task<Result<TransportCostDto>> Handle(GetTransportCostByIdQuery request, CancellationToken cancellationToken)
        {
            var transportCost = await transportCostRepository.GetByIdAsync(request.TransportCostId);
            if (transportCost == null)
                return Result<TransportCostDto>.Failure("Transport cost not found");

            var transportCostDto = mapper.Map<TransportCostDto>(transportCost);
            return Result<TransportCostDto>.Success(transportCostDto);
        }
    }
}
