using MediatR;

namespace Application.Use_Cases.Commands.TransportCostCommands
{
    public class CreateTransportCostCommand : IRequest<Guid>
    {
        public required Guid SourceLocationId { get; set; }
        public required Guid DestinationLocationId { get; set; }
        public decimal Cost { get; set; }
    }
}
