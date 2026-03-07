using Domain.Enums;

namespace DTOs
{
    public class LocationDto
    {
        public Guid LocationId { get; set; }
        public required string Name { get; set; }
        public required string County { get; set; }
        public required string Locality { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public ProfileType Profile { get; set; }
        public PurchasingPower PurchasingPower { get; set; }
    }
}
