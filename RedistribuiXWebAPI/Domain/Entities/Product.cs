using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Product
    {
        public Guid ProductId { get; set; }
        public required string Sku { get; set; }
        public required string Name { get; set; }
        public ProductCategory Category { get; set; }

        // solves the problem of universal accessories
        public Guid? PhoneModelId { get; set; }
        public virtual PhoneModel? PhoneModel { get; set; }
        public decimal SalePrice { get; set; }
        public decimal PurchasePrice { get; set; }
        public Product()
        {
            ProductId = Guid.NewGuid();
        }
    }
}
