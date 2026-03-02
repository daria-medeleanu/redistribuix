using FluentValidation;
using MediatR;
using Application.Use_Cases.Commands.UserCommand;

namespace Application.Use_Cases.Commands.StandManagerCommands
{
    public class UpdateStandManagerCommandValidator : UserCommandsValidator<UpdateStandManagerCommand, Guid>
    {
        public UpdateStandManagerCommandValidator()
        {
            RuleFor(x => x.LocationId)
                .NotEmpty().WithMessage("LocationId is required.");
            // Add more rules if needed
        }
    }
}
