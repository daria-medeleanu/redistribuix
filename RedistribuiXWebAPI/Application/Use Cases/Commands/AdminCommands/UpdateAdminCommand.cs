
using Application.Use_Cases.Commands.UserCommands;
using MediatR;

namespace Application.Use_Cases.Commands.AdminCommands // <-- Fix namespace here
{
    public class UpdateAdminCommand : UserCommands<Unit>
    {
        public Guid Id { get; set; }
    }
}