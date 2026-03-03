using FluentValidation;

namespace Application.Use_Cases.Commands.DailySaleCommands
{
    public class UpdateDailySaleCommandValidator : AbstractValidator<UpdateDailySaleCommand>
    {
        public UpdateDailySaleCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required.");

            RuleFor(x => x.LocationId)
                .NotEmpty().WithMessage("LocationId is required.");

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("ProductId is required.");

            RuleFor(x => x.QuantitySold)
                .GreaterThan(0).WithMessage("QuantitySold must be greater than 0.");

            RuleFor(x => x.SaleDate)
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("SaleDate cannot be in the future.");
        }
    }
}
