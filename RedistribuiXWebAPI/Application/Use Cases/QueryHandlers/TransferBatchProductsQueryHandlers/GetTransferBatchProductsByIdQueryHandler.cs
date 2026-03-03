using Application.DTOs;
using Application.Use_Cases.Queries.TransferBatchProductsQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.TransferBatchProductsQueryHandlers
{
    public class GetTransferBatchProductsByIdQueryHandler : IRequestHandler<GetTransferBatchProductsByIdQuery, Result<TransferBatchProductsDto>>
    {
        private readonly ITransferBatchProductsRepository repository;
        private readonly IMapper mapper;

        public GetTransferBatchProductsByIdQueryHandler(ITransferBatchProductsRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<TransferBatchProductsDto>> Handle(GetTransferBatchProductsByIdQuery request, CancellationToken cancellationToken)
        {
            var transferBatchProducts = await repository.GetByIdAsync(request.TransferBatchProductsId);
            if (transferBatchProducts == null)
                return Result<TransferBatchProductsDto>.Failure("Transfer batch product not found");

            var transferBatchProductsDto = mapper.Map<TransferBatchProductsDto>(transferBatchProducts);
            return Result<TransferBatchProductsDto>.Success(transferBatchProductsDto);
        }
    }
}
