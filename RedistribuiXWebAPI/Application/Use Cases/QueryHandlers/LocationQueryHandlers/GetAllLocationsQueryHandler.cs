using Application.Use_Cases.Queries.LocationQueries;
using AutoMapper;
using Domain.Repositories;
using DTOs;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers.LocationQueryHandlers
{
    public class GetAllLocationsQueryHandler : IRequestHandler<GetAllLocationsQuery, List<LocationDto>>
    {
        private readonly ILocationRepository locationRepository;
        private readonly IMapper mapper;

        public GetAllLocationsQueryHandler(ILocationRepository locationRepository, IMapper mapper)
        {
            this.locationRepository = locationRepository;
            this.mapper = mapper;
        }

        public async Task<List<LocationDto>> Handle(GetAllLocationsQuery request, CancellationToken cancellationToken)
        {
            var locations = await locationRepository.GetAllAsync();
            return mapper.Map<List<LocationDto>>(locations);
        }
    }
}
