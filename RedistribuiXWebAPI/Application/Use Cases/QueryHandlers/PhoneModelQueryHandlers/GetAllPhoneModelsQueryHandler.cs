using Application.Use_Cases.Queries.PhoneModelQueries;
using AutoMapper;
using Domain.Repositories;
using DTOs;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers.PhoneModelQueryHandlers
{
    public class GetAllPhoneModelsQueryHandler : IRequestHandler<GetAllPhoneModelsQuery, List<PhoneModelDto>>
    {
        private readonly IPhoneModelRepository phoneModelRepository;
        private readonly IMapper mapper;

        public GetAllPhoneModelsQueryHandler(IPhoneModelRepository phoneModelRepository, IMapper mapper)
        {
            this.phoneModelRepository = phoneModelRepository;
            this.mapper = mapper;
        }

        public async Task<List<PhoneModelDto>> Handle(GetAllPhoneModelsQuery request, CancellationToken cancellationToken)
        {
            var phoneModels = await phoneModelRepository.GetAllAsync();
            return mapper.Map<List<PhoneModelDto>>(phoneModels);
        }
    }
}
