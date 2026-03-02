using MediatR;

namespace Application.Use_Cases.Authentification
{
    public class LoginCommand : IRequest<string>
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // "Admin", "StandManager", etc.
    }
}
