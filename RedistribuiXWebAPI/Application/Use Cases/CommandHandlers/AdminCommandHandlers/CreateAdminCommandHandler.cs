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
    public class CreateAdminCommandHandler : IRequestHandler<CreateAdminCommand, Result<Unit>>
    {
        private readonly IAdminRepository repository;
        private readonly IMapper mapper;

        public CreateAdminCommandHandler(IAdminRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<Unit>> Handle(CreateAdminCommand request, CancellationToken cancellationToken)
        {
            var admin = mapper.Map<Admin>(request);
            admin.PasswordHash = PasswordHasher.HashPassword(request.Password);
            await repository.AddAsync(admin);
            return Result<Unit>.Success(Unit.Value);
        }
    }
}
