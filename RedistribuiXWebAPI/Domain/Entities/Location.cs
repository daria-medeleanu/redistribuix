using Domain.Enums;

namespace Domain.Entities
{
    public class Location
    {
        public Guid LocationId { get; private set; }
        public string Name { get; private set; }
        public ProfileType Profile { get; private set; }
        public PurchasingPower PurchasingPower { get; private set; }

        private Location() { }

        public Location(string name, ProfileType profile, PurchasingPower purchasingPower)
        {
            LocationId = Guid.NewGuid();
            Name = name;
            Profile = profile;
            PurchasingPower = purchasingPower;
        }
    }
}
