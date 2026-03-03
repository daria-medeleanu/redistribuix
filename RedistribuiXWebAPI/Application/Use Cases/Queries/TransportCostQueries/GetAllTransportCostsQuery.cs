using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.TransportCostQueries
{
    public class GetAllTransportCostsQuery : IRequest<List<TransportCostDto>>
    {
    }
}
