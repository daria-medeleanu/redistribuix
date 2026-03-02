using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Repositories;
using Application.Use_Cases.Queries.AdminQueries;
using AutoMapper;
using DTOs;

namespace Application.Use_Cases.QueryHandlers.AdminQueryHandlers
{
    public class GetAllAdminsQueryHandler : IRequestHandler<GetAllAdminsQuery, List<AdminDto>>
    {
        private readonly IAdminRepository adminRepository;
        private readonly IMapper mapper;

        public GetAllAdminsQueryHandler(IAdminRepository adminRepository, IMapper mapper)
        {
            this.adminRepository = adminRepository;
            this.mapper = mapper;
        }

        public async Task<List<AdminDto>> Handle(GetAllAdminsQuery request, CancellationToken cancellationToken)
        {
            var admins = await adminRepository.GetAllAsync();
            return mapper.Map<List<AdminDto>>(admins);
        }
    }
}
