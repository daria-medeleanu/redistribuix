using Domain.Enums;
using MediatR;

namespace Application.Use_Cases.Commands.ProductCommands
{
    public class UpdateProductCommand : IRequest<bool>
    {
        public required Guid ProductId { get; set; }
        public required string Sku { get; set; }
        public required string Name { get; set; }
        public ProductCategory Category { get; set; }
        public Guid? PhoneModelId { get; set; }
        public decimal SalePrice { get; set; }
        public decimal PurchasePrice { get; set; }
    }
}
