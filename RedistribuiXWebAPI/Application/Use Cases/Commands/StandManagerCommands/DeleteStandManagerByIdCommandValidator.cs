using FluentValidation;

namespace Application.Use_Cases.Commands.StandManagerCommands
{
    public class DeleteStandManagerByIdCommandValidator : AbstractValidator<DeleteStandManagerByIdCommand>
    {
        public DeleteStandManagerByIdCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required.");
        }
    }
}
