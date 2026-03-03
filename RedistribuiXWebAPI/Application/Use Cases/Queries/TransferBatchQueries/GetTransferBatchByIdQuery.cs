using Application.DTOs;
using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Queries.TransferBatchQueries
{
    public class GetTransferBatchByIdQuery : IRequest<Result<TransferBatchDto>>
    {
        public Guid TransferBatchId { get; set; }
    }
}
