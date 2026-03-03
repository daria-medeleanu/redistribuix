namespace DTOs
{
    public class DailySaleDto
    {
        public int Id { get; set; }
        public Guid LocationId { get; set; }
        public Guid ProductId { get; set; }

        public DateTime SaleDate { get; set; }
        public int QuantitySold { get; set; }
    }
}
