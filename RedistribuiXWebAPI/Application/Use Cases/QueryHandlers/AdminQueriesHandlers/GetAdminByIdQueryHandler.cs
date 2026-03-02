using Application.Use_Cases.Queries.AdminQueries;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using DTOs;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers.AdminQueryHandlers
{
    public class GetAdminByIdQueryHandler : IRequestHandler<GetAdminByIdQuery, Result<AdminDto>>
    {
        private readonly IAdminRepository adminRepository;
        private readonly IMapper mapper;

        public GetAdminByIdQueryHandler(IAdminRepository adminRepository, IMapper mapper)
        {
            this.adminRepository = adminRepository;
            this.mapper = mapper;
        }

        public async Task<Result<AdminDto>> Handle(GetAdminByIdQuery request, CancellationToken cancellationToken)
        {
            var admin = await adminRepository.GetByIdAsync(request.Id);
            if (admin == null)
            {
                return Result<AdminDto>.Failure("Admin not found");
            }
            var adminDto = mapper.Map<AdminDto>(admin);
            return Result<AdminDto>.Success(adminDto);
        }
    }
}

