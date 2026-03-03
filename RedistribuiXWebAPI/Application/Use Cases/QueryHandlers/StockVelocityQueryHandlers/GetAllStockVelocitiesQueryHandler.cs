using Application.Use_Cases.Queries.StockVelocityQueries;
using AutoMapper;
using Domain.Repositories;
using DTOs;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.StockVelocityQueryHandlers
{
    public class GetAllStockVelocitiesQueryHandler : IRequestHandler<GetAllStockVelocitiesQuery, List<StockVelocityDto>>
    {
        private readonly IStockVelocityRepository repository;
        private readonly IMapper mapper;

        public GetAllStockVelocitiesQueryHandler(IStockVelocityRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<StockVelocityDto>> Handle(GetAllStockVelocitiesQuery request, CancellationToken cancellationToken)
        {
            var entities = await repository.GetAllAsync();
            return mapper.Map<List<StockVelocityDto>>(entities);
        }
    }
}
