using Application.Use_Cases.Queries.StockVelocityQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using DTOs;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.StockVelocityQueryHandlers
{
    public class GetStockVelocityByIdQueryHandler : IRequestHandler<GetStockVelocityByIdQuery, Result<StockVelocityDto>>
    {
        private readonly IStockVelocityRepository repository;
        private readonly IMapper mapper;

        public GetStockVelocityByIdQueryHandler(IStockVelocityRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<StockVelocityDto>> Handle(GetStockVelocityByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await repository.GetByIdAsync(request.Id);
            if (entity == null)
            {
                return Result<StockVelocityDto>.Failure("Stock velocity record not found");
            }

            var dto = mapper.Map<StockVelocityDto>(entity);
            return Result<StockVelocityDto>.Success(dto);
        }
    }
}
