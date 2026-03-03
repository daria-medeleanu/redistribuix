using DTOs;
using MediatR;
using System.Collections.Generic;

namespace Application.Use_Cases.Queries.LocationQueries
{
    public class GetAllLocationsQuery : IRequest<List<LocationDto>>
    {
    }
}
