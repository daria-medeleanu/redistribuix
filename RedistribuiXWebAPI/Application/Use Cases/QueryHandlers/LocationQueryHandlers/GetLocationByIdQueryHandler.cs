using Application.Use_Cases.Queries.LocationQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using DTOs;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers.LocationQueryHandlers
{
    public class GetLocationByIdQueryHandler : IRequestHandler<GetLocationByIdQuery, Result<LocationDto>>
    {
        private readonly ILocationRepository locationRepository;
        private readonly IMapper mapper;

        public GetLocationByIdQueryHandler(ILocationRepository locationRepository, IMapper mapper)
        {
            this.locationRepository = locationRepository;
            this.mapper = mapper;
        }

        public async Task<Result<LocationDto>> Handle(GetLocationByIdQuery request, CancellationToken cancellationToken)
        {
            var location = await locationRepository.GetByIdAsync(request.LocationId);
            if (location == null)
            {
                return Result<LocationDto>.Failure("Location not found");
            }
            var locationDto = mapper.Map<LocationDto>(location);
            return Result<LocationDto>.Success(locationDto);
        }
    }
}
