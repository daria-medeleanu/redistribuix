using Domain.Enums;

namespace Domain.Entities
{
    public class Location
    {
        public Guid LocationId { get; private set; }
        public string Name { get; private set; }
        public string? Address { get; private set; }  // Optional street address
        public string County { get; private set; }
        public string Locality { get; private set; }
        public double Latitude { get; private set; }
        public double Longitude { get; private set; }
        public ProfileType Profile { get; private set; }
        public PurchasingPower PurchasingPower { get; private set; }

        private Location() { }

        public Location(
            string name,
            string county,
            string locality,
            double latitude,
            double longitude,
            ProfileType profile,
            PurchasingPower purchasingPower,
            string? address = null)
        {
            LocationId = Guid.NewGuid();
            Name = name;
            Address = address;
            County = county;
            Locality = locality;
            Latitude = latitude;
            Longitude = longitude;
            Profile = profile;
            PurchasingPower = purchasingPower;
        }
    }
}