using Application.DTOs;
using Application.Use_Cases.Queries.TransferBatchProductsQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.TransferBatchProductsQueryHandlers
{
    public class GetAllTransferBatchProductsByBatchIdQueryHandler : IRequestHandler<GetAllTransferBatchProductsQuery, List<TransferBatchProductsDto>>
    {
        private readonly ITransferBatchProductsRepository repository;
        private readonly IMapper mapper;

        public GetAllTransferBatchProductsByBatchIdQueryHandler(ITransferBatchProductsRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<TransferBatchProductsDto>> Handle(GetAllTransferBatchProductsQuery request, CancellationToken cancellationToken)
        {
            var transferBatchProducts = await repository.GetAllAsync();
            return mapper.Map<List<TransferBatchProductsDto>>(transferBatchProducts);
        }
    }
}
