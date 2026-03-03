using Application.DTOs;
using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Queries.TransferBatchProductsQueries
{
    public class GetTransferBatchProductsByIdQuery : IRequest<Result<TransferBatchProductsDto>>
    {
        public Guid TransferBatchProductsId { get; set; }
    }
}
