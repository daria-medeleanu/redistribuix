using Application.Use_Cases.Queries.DailySaleQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using DTOs;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.DailySaleQueryHandlers
{
    public class GetDailySaleByIdQueryHandler : IRequestHandler<GetDailySaleByIdQuery, Result<DailySaleDto>>
    {
        private readonly IDailySaleRepository repository;
        private readonly IMapper mapper;

        public GetDailySaleByIdQueryHandler(IDailySaleRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<DailySaleDto>> Handle(GetDailySaleByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await repository.GetByIdAsync(request.Id);
            if (entity == null)
            {
                return Result<DailySaleDto>.Failure("Daily sale not found");
            }

            var dto = mapper.Map<DailySaleDto>(entity);
            return Result<DailySaleDto>.Success(dto);
        }
    }
}
