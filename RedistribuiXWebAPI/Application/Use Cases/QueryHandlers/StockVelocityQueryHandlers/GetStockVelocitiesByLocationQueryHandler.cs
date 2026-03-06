using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Use_Cases.Queries.StockVelocityQueries;
using AutoMapper;
using Domain.Repositories;
using DTOs;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.StockVelocityQueryHandlers
{
    public class GetStockVelocitiesByLocationQueryHandler : IRequestHandler<GetStockVelocitiesByLocationQuery, List<StockVelocityDto>>
    {
        private readonly IStockVelocityRepository repository;
        private readonly IMapper mapper;

        public GetStockVelocitiesByLocationQueryHandler(IStockVelocityRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<StockVelocityDto>> Handle(GetStockVelocitiesByLocationQuery request, CancellationToken cancellationToken)
        {
            var entities = await repository.GetByLocationAsync(request.LocationId);
            return mapper.Map<List<StockVelocityDto>>(entities.ToList());
        }
    }
}
