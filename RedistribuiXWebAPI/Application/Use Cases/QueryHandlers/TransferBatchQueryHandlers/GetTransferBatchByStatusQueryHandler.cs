using Application.DTOs;
using Application.Use_Cases.Queries.TransferBatchQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.TransferBatchQueryHandlers
{
    public class GetTransferBatchesByStatusQueryHandler : IRequestHandler<GetTransferBatchesByStatusQuery, List<TransferBatchDto>>
    {
        private readonly ITransferBatchRepository repository;
        private readonly IMapper mapper;

        public GetTransferBatchesByStatusQueryHandler(ITransferBatchRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<TransferBatchDto>> Handle(GetTransferBatchesByStatusQuery request, CancellationToken cancellationToken)
        {
            var transferBatches = await repository.GetByStatusAsync(request.Status);
            return mapper.Map<List<TransferBatchDto>>(transferBatches);
        }
    }
}
