using Application.DTOs;
using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Queries.TransportCostQueries
{
    public class GetTransportCostByIdQuery : IRequest<Result<TransportCostDto>>
    {
        public Guid TransportCostId { get; set; }
    }
}
