using Application.Use_Cases.Commands.AdminCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Domain.Services;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers.AdminCommandHandlers
{
    public class CreateAdminCommandHandler : IRequestHandler<CreateAdminCommand, Result<Guid>>
    {
        private readonly IAdminRepository repository;
        private readonly IMapper mapper;

        public CreateAdminCommandHandler(IAdminRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<Guid>> Handle(CreateAdminCommand request, CancellationToken cancellationToken)
        {
            var admin = mapper.Map<Admin>(request);
            admin.PasswordHash = PasswordHasher.HashPassword(request.Password);
            var result = await repository.AddAsync(admin);
            if (result.IsSuccess)
            {
                return Result<Guid>.Success(result.Data); // Return the new admin's Guid
            }
            return Result<Guid>.Failure(result.ErrorMessage);
        }


    }
}
