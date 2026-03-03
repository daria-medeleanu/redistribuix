using Application.DTOs;
using Domain.Enums;
using MediatR;

namespace Application.Use_Cases.Queries.TransferBatchQueries
{
    public class GetTransferBatchesByStatusQuery : IRequest<List<TransferBatchDto>>
    {
        public StatusTransfer Status { get; set; }
    }
}
