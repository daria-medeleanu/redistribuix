using MediatR;

namespace Application.Use_Cases.Commands.TransportCostCommands
{
    public class UpdateTransportCostCommand : IRequest<bool>
    {
        public required Guid TransportCostId { get; set; }
        public required Guid SourceLocationId { get; set; }
        public required Guid DestinationLocationId { get; set; }
        public decimal Cost { get; set; }
    }
}
