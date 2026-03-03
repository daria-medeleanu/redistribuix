namespace Domain.Entities
{
    public class TransportCost
    {
        public Guid TransportCostId { get; set; }
        public Guid SourceLocationId { get; set; }
        public Guid DestinationLocationId { get; set; }
        public decimal Cost { get; set; }

        public Location SourceLocation { get; set; } = null!;
        public Location DestinationLocation { get; set; } = null!;

        public TransportCost() { 
            
        }

    }
}
