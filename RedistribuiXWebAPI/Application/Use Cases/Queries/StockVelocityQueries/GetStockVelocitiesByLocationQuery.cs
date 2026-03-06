using System;
using System.Collections.Generic;
using DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.StockVelocityQueries
{
    public class GetStockVelocitiesByLocationQuery : IRequest<List<StockVelocityDto>>
    {
        public Guid LocationId { get; set; }
    }
}
