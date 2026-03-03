using FluentValidation;

namespace Application.Use_Cases.Commands.CalendarEventCommands
{
    public class DeleteCalendarEventByIdCommandValidator : AbstractValidator<DeleteCalendarEventByIdCommand>
    {
        public DeleteCalendarEventByIdCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required.");
        }
    }
}
