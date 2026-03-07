using Domain.Enums;
using MediatR;

namespace Application.Use_Cases.Commands.LocationCommands
{
    public class CreateLocationCommand : IRequest<Guid>
    {
        public required string Name { get; set; }
        public string? Address { get; set; }
        public required string County { get; set; }
        public required string Locality { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public required ProfileType Profile { get; set; }
        public required PurchasingPower PurchasingPower { get; set; }
    }
}
