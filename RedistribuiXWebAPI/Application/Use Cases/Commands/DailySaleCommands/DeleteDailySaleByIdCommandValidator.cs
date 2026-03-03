using FluentValidation;

namespace Application.Use_Cases.Commands.DailySaleCommands
{
    public class DeleteDailySaleByIdCommandValidator : AbstractValidator<DeleteDailySaleByIdCommand>
    {
        public DeleteDailySaleByIdCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required.");
        }
    }
}
