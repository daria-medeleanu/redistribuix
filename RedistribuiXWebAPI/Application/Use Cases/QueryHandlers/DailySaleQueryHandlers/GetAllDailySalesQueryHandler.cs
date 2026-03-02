using Application.Use_Cases.Queries.DailySaleQueries;
using AutoMapper;
using Domain.Repositories;
using DTOs;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.DailySaleQueryHandlers
{
    public class GetAllDailySalesQueryHandler : IRequestHandler<GetAllDailySalesQuery, List<DailySaleDto>>
    {
        private readonly IDailySaleRepository repository;
        private readonly IMapper mapper;

        public GetAllDailySalesQueryHandler(IDailySaleRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<DailySaleDto>> Handle(GetAllDailySalesQuery request, CancellationToken cancellationToken)
        {
            var entities = await repository.GetAllAsync();
            return mapper.Map<List<DailySaleDto>>(entities);
        }
    }
}
