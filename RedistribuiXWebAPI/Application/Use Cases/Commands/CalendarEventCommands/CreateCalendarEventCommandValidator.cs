using FluentValidation;

namespace Application.Use_Cases.Commands.CalendarEventCommands
{
    public class CreateCalendarEventCommandValidator : AbstractValidator<CreateCalendarEventCommand>
    {
        public CreateCalendarEventCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name must be at most 100 characters.");

            RuleFor(x => x.EventType)
                .IsInEnum().WithMessage("EventType must be a valid value.");

            RuleFor(x => x.AffectedLocationType)
                .IsInEnum().WithMessage("AffectedLocationType must be a valid value.");

            RuleFor(x => x.DemandMultiplier)
                .GreaterThan(0).WithMessage("DemandMultiplier must be greater than 0.");

            RuleFor(x => x.EndDate)
                .GreaterThan(x => x.StartDate)
                .WithMessage("EndDate must be greater than StartDate.");
        }
    }
}
