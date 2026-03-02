using Domain.Common;
using DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.DailySaleQueries
{
    public class GetDailySaleByIdQuery : IRequest<Result<DailySaleDto>>
    {
        public int Id { get; set; }
    }
}
