using Domain.Common;
using DTOs;
using MediatR;
using System;

namespace Application.Use_Cases.Queries.LocationQueries
{
    public class GetLocationByIdQuery : IRequest<Result<LocationDto>>
    {
        public Guid LocationId { get; set; }
    }
}
