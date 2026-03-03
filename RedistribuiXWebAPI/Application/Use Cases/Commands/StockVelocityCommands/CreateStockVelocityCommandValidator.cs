using FluentValidation;

namespace Application.Use_Cases.Commands.StockVelocityCommands
{
    public class CreateStockVelocityCommandValidator : AbstractValidator<CreateStockVelocityCommand>
    {
        public CreateStockVelocityCommandValidator()
        {
            RuleFor(x => x.LocationId)
                .NotEmpty().WithMessage("LocationId is required.");

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("ProductId is required.");

            RuleFor(x => x.CurrentQuantity)
                .GreaterThanOrEqualTo(0).WithMessage("CurrentQuantity must be greater than or equal to 0.");

            RuleFor(x => x.SalesLast30Days)
                .GreaterThanOrEqualTo(0).WithMessage("SalesLast30Days must be greater than or equal to 0.");

            RuleFor(x => x.SalesLast100Days)
                .GreaterThanOrEqualTo(0).WithMessage("SalesLast100Days must be greater than or equal to 0.");

            RuleFor(x => x.LastInboundDate)
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("LastInboundDate cannot be in the future.");

            RuleFor(x => x.LastInventoryDate)
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("LastInventoryDate cannot be in the future.");

            RuleFor(x => x)
                .Must(x => x.LastInventoryDate >= x.LastInboundDate)
                .WithMessage("LastInventoryDate must be on or after LastInboundDate.");
        }
    }
}
