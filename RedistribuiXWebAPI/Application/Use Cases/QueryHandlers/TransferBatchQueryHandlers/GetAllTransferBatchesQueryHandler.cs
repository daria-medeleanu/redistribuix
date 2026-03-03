using Application.DTOs;
using Application.Use_Cases.Queries.TransferBatchQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.TransferBatchQueryHandlers
{
    public class GetAllTransferBatchesQueryHandler : IRequestHandler<GetAllTransferBatchesQuery, List<TransferBatchDto>>
    {
        private readonly ITransferBatchRepository repository;
        private readonly IMapper mapper;

        public GetAllTransferBatchesQueryHandler(ITransferBatchRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<TransferBatchDto>> Handle(GetAllTransferBatchesQuery request, CancellationToken cancellationToken)
        {
            var transferBatches = await repository.GetAllAsync();
            return mapper.Map<List<TransferBatchDto>>(transferBatches);
        }
    }
}
