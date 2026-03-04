using Application.Use_Cases.Queries.StandManagerQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using DTOs;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers.StandManagerQueryHandlers
{
    public class GetStandManagerByIdQueryHandler : IRequestHandler<GetStandManagerByIdQuery, Result<StandManagerDto>>
    {
        private readonly IStandManagerRepository repository;
        private readonly IMapper mapper;

        public GetStandManagerByIdQueryHandler(IStandManagerRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<StandManagerDto>> Handle(GetStandManagerByIdQuery request, CancellationToken cancellationToken)
        {
            var standManager = await repository.GetByIdAsync(request.Id);
            if (standManager == null)
            {
                return Result<StandManagerDto>.Failure("StandManager not found");
            }
            var dto = mapper.Map<StandManagerDto>(standManager);
            return Result<StandManagerDto>.Success(dto);
        }
    }
}
