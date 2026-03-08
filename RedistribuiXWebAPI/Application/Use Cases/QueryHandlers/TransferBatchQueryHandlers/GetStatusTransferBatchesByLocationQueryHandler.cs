using Application.DTOs;
using Application.Use_Cases.Queries.TransferBatchQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.TransferBatchQueryHandlers
{
    public class GetStatusTransferBatchesByLocationQueryHandler
        : IRequestHandler<GetStatusTransferBatchesByLocationQuery, List<TransferBatchDto>>
    {
        private readonly ITransferBatchRepository repository;
        private readonly IMapper mapper;

        public GetStatusTransferBatchesByLocationQueryHandler(ITransferBatchRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<TransferBatchDto>> Handle(
            GetStatusTransferBatchesByLocationQuery request,
            CancellationToken cancellationToken)
        {
            var transferBatches = await repository.GetByStatusAndLocationAsync(request.LocationId, request.Status);
            return mapper.Map<List<TransferBatchDto>>(transferBatches);
        }
    }
}