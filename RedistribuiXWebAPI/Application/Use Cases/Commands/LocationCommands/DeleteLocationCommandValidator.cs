using FluentValidation;

namespace Application.Use_Cases.Commands.LocationCommands
{
    public class DeleteLocationCommandValidator : AbstractValidator<DeleteLocationCommand>
    {
        public DeleteLocationCommandValidator()
        {
            RuleFor(x => x.LocationId)
                .NotEmpty().WithMessage("LocationId is required.");
        }
    }
}
