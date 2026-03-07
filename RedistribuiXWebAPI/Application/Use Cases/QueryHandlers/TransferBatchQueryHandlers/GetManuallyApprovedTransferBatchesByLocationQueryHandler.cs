using Application.DTOs;
using Application.Use_Cases.Queries.TransferBatchQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.TransferBatchQueryHandlers
{
    public class GetManuallyApprovedTransferBatchesByLocationQueryHandler
        : IRequestHandler<GetManuallyApprovedTransferBatchesByLocationQuery, List<TransferBatchDto>>
    {
        private readonly ITransferBatchRepository repository;
        private readonly IMapper mapper;

        public GetManuallyApprovedTransferBatchesByLocationQueryHandler(ITransferBatchRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<TransferBatchDto>> Handle(
            GetManuallyApprovedTransferBatchesByLocationQuery request,
            CancellationToken cancellationToken)
        {
            var transferBatches = await repository.GetManuallyApprovedByLocationAsync(request.LocationId);
            return mapper.Map<List<TransferBatchDto>>(transferBatches);
        }
    }
}
