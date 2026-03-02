using Domain.Enums;

namespace DTOs
{
    public class LocationDto
    {
        public Guid LocationId { get; set; }
        public required string Name { get; set; }
        public ProfileType Profile { get; set; }
        public PurchasingPower PurchasingPower { get; set; }
    }
}
