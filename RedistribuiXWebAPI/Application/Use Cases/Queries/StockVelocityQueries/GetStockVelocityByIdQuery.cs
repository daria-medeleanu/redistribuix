using Domain.Common;
using DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.StockVelocityQueries
{
    public class GetStockVelocityByIdQuery : IRequest<Result<StockVelocityDto>>
    {
        public Guid Id { get; set; }
    }
}
