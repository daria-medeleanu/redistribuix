using MediatR;
using Application.Use_Cases.Commands.UserCommand;
namespace Application.Use_Cases.Commands.AdminCommands
{
    public class UpdateAdminCommand : UserCommands<Guid>
    {
        public Guid Id { get; set; }
        // Inherit Name, Email, Password from UserCommands<U>
    }
}
