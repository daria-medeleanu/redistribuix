using Domain.Common;
using DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.StandManagerQueries
{
    public class GetStandManagerByIdQuery : IRequest<Result<StandManagerDto>>
    {
        public Guid Id { get; set; }
    }
}
