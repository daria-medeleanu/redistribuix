using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.TransferBatchProductsQueries
{
    public class GetAllTransferBatchProductsQuery : IRequest<List<TransferBatchProductsDto>>
    {
    }
}
