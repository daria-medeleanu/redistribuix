using Application.Use_Cases.Queries.StandManagerQueries;
using AutoMapper;
using Domain.Repositories;
using DTOs;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers.StandManagerQueryHandlers
{
    public class GetAllStandManagersQueryHandler : IRequestHandler<GetAllStandManagersQuery, List<StandManagerDto>>
    {
        private readonly IStandManagerRepository repository;
        private readonly IMapper mapper;

        public GetAllStandManagersQueryHandler(IStandManagerRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<StandManagerDto>> Handle(GetAllStandManagersQuery request, CancellationToken cancellationToken)
        {
            var standManagers = await repository.GetAllAsync();
            return mapper.Map<List<StandManagerDto>>(standManagers);
        }
    }
}
