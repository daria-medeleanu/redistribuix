using Domain.Enums;

namespace DTOs
{
    public class ProductDto
    {
        public Guid ProductId { get; set; }
        public string Sku { get; set; }
        public string Name { get; set; }
        public ProductCategory Category { get; set; }
        public Guid? PhoneModelId { get; set; }
        public decimal SalePrice { get; set; }
        public decimal PurchasePrice { get; set; }
    }
}
