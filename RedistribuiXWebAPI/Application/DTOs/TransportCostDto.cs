namespace Application.DTOs
{
    public class TransportCostDto
    {
        public Guid TransportCostId { get; set; }
        public Guid SourceLocationId { get; set; }
        public Guid DestinationLocationId { get; set; }
        public decimal Cost { get; set; }

    }
}
