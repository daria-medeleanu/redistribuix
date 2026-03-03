using Domain.Enums;
using MediatR;

namespace Application.Use_Cases.Commands.LocationCommands
{
    public class UpdateLocationCommand : IRequest<bool>
    {
        public required Guid LocationId { get; set; }
        public required string Name { get; set; }
        public required ProfileType Profile { get; set; }
        public required PurchasingPower PurchasingPower { get; set; }
    }
}
