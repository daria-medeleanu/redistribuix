using DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.DailySaleQueries
{
    public class GetAllDailySalesQuery : IRequest<List<DailySaleDto>>
    {
    }
}
