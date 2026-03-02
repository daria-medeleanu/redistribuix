using Application.Use_Cases.Commands.UserCommands;
using MediatR;

namespace Application.Use_Cases.Commands.AdminCommands
{
    public class CreateAdminCommand : UserCommands<Guid>
    {
    }
}
