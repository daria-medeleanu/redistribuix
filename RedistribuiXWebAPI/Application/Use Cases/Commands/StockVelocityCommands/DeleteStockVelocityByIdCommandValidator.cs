using FluentValidation;

namespace Application.Use_Cases.Commands.StockVelocityCommands
{
    public class DeleteStockVelocityByIdCommandValidator : AbstractValidator<DeleteStockVelocityByIdCommand>
    {
        public DeleteStockVelocityByIdCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required.");
        }
    }
}
