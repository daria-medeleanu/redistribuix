namespace Domain.Entities
{
    public class DailySale
    {
        public Guid Id { get; set; }

        public Guid LocationId { get; set; }
        public Location Location { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        public DateTime SaleDate { get; set; }
        public int QuantitySold { get; set; }

        public DailySale()
        {
            Id = Guid.NewGuid();
        }
    }
}
