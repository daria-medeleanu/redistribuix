using FluentValidation;

namespace Application.Use_Cases.Commands.LocationCommands
{
    public class CreateLocationCommandValidator : AbstractValidator<CreateLocationCommand>
    {
        public CreateLocationCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.");

            RuleFor(x => x.Profile)
                .IsInEnum().WithMessage("Profile must be a valid value.");

            RuleFor(x => x.PurchasingPower)
                .IsInEnum().WithMessage("PurchasingPower must be a valid value.");
        }
    }
}
