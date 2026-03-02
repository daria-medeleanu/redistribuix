using Domain.Repositories;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.Authentification
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, string>
    {
        private readonly IAdminRepository adminRepository;
        private readonly IStandManagerRepository standManagerRepository;
        // Add other repositories as needed

        public LoginCommandHandler(
            IAdminRepository adminRepository,
            IStandManagerRepository standManagerRepository)
        {
            this.adminRepository = adminRepository;
            this.standManagerRepository = standManagerRepository;
        }

        public async Task<string> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            switch (request.Role)
            {
                case "Admin":
                    var adminLogin = await adminRepository.LoginAsync(request.Email, request.Password);
                    return adminLogin?.Token ?? throw new Exception("Invalid credentials or role.");
                case "StandManager":
                    var smLogin = await standManagerRepository.LoginAsync(request.Email, request.Password);
                    return smLogin?.Token ?? throw new Exception("Invalid credentials or role.");
                // Add more roles as needed
                default:
                    throw new Exception("Role not supported.");
            }
        }
    }
}
