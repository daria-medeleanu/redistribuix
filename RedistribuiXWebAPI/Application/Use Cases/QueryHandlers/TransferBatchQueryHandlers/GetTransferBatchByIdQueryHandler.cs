using Application.DTOs;
using Application.Use_Cases.Queries.TransferBatchQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.TransferBatchQueryHandlers
{
    public class GetTransferBatchByIdQueryHandler : IRequestHandler<GetTransferBatchByIdQuery, Result<TransferBatchDto>>
    {
        private readonly ITransferBatchRepository repository;
        private readonly IMapper mapper;

        public GetTransferBatchByIdQueryHandler(ITransferBatchRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<TransferBatchDto>> Handle(GetTransferBatchByIdQuery request, CancellationToken cancellationToken)
        {
            var transferBatch = await repository.GetByIdAsync(request.TransferBatchId);
            if (transferBatch == null)
                return Result<TransferBatchDto>.Failure("Transfer batch not found");

            var transferBatchDto = mapper.Map<TransferBatchDto>(transferBatch);
            return Result<TransferBatchDto>.Success(transferBatchDto);
        }
    }
}
