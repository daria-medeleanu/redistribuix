using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.TransferBatchQueries
{

    public class GetManuallyApprovedTransferBatchesByLocationQuery : IRequest<List<TransferBatchDto>>
    {
        public Guid LocationId { get; set; }
    }
}
