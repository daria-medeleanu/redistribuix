using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.TransferBatchProductsQueries
{
    public class GetAllTransferBatchProductsByBatchIdQuery : IRequest<List<TransferBatchProductsDto>>
    {
        public Guid TransferBatchId { get; set; }
    }
}
