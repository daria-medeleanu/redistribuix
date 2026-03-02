using Application.Use_Cases.Commands.UserCommands;
using FluentValidation;
using MediatR;

namespace Application.Use_Cases.Commands.StandManagerCommands
{
    public class CreateStandManagerCommandValidator : UserCommandsValidator<CreateStandManagerCommand, Guid>
    {
        public CreateStandManagerCommandValidator()
        {
            RuleFor(x => x.LocationId)
                .NotEmpty().WithMessage("LocationId is required.");
        }
    }
}
