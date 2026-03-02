using Application.Use_Cases.Commands.UserCommand;
using FluentValidation;
using MediatR;

namespace Application.Use_Cases.Commands.AdminCommands
{
    public class CreateAdminCommandValidator : UserCommandsValidator<CreateAdminCommand, Unit>
    {
    }
}
