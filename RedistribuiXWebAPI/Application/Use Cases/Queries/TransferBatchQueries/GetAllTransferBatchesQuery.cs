using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.TransferBatchQueries
{
    public class GetAllTransferBatchesQuery : IRequest<List<TransferBatchDto>>
    {
    }
}
