using FluentValidation;
using MediatR;
using Application.Use_Cases.Commands.UserCommand;
using Application.Use_Cases.Commands.AdminCommands;

namespace Application.Use_Cases.Commands.AdminCommand
{
    public class UpdateAdminCommandValidator : UserCommandsValidator<UpdateAdminCommand, Guid>
    {
        public UpdateAdminCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required.");
        }
    }
}