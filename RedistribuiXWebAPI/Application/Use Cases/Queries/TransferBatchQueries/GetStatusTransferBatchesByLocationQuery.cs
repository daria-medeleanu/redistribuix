using Application.DTOs;
using Domain.Enums;
using MediatR;

namespace Application.Use_Cases.Queries.TransferBatchQueries
{
    public class GetStatusTransferBatchesByLocationQuery : IRequest<List<TransferBatchDto>>
    {
        public Guid LocationId { get; set; }
        public StatusTransfer Status { get; set; }
    }
}