using DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.StockVelocityQueries
{
    public class GetAllStockVelocitiesQuery : IRequest<List<StockVelocityDto>>
    {
    }
}
