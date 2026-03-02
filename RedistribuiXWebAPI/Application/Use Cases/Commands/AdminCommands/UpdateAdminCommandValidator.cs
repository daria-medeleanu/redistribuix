using FluentValidation;
using MediatR;
using Application.Use_Cases.Commands.UserCommands;
using Application.Use_Cases.Commands.AdminCommands;

namespace Application.Use_Cases.Commands.AdminCommands
{
    public class UpdateAdminCommandValidator : UserCommandsValidator<UpdateAdminCommand, Unit>
    {
        public UpdateAdminCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required.");
        }
    }
}
