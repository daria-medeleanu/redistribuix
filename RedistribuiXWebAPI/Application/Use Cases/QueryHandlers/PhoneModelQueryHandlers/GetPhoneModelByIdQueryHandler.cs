using Application.Use_Cases.Queries.PhoneModelQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using DTOs;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers.PhoneModelQueryHandlers
{
    public class GetPhoneModelByIdQueryHandler : IRequestHandler<GetPhoneModelByIdQuery, Result<PhoneModelDto>>
    {
        private readonly IPhoneModelRepository phoneModelRepository;
        private readonly IMapper mapper;

        public GetPhoneModelByIdQueryHandler(IPhoneModelRepository phoneModelRepository, IMapper mapper)
        {
            this.phoneModelRepository = phoneModelRepository;
            this.mapper = mapper;
        }

        public async Task<Result<PhoneModelDto>> Handle(GetPhoneModelByIdQuery request, CancellationToken cancellationToken)
        {
            var phoneModel = await phoneModelRepository.GetByIdAsync(request.ModelId);
            if (phoneModel == null)
            {
                return Result<PhoneModelDto>.Failure("Phone model not found");
            }
            var phoneModelDto = mapper.Map<PhoneModelDto>(phoneModel);
            return Result<PhoneModelDto>.Success(phoneModelDto);
        }
    }
}
