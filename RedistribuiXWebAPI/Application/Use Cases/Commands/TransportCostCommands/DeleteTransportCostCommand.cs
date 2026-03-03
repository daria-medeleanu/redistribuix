using MediatR;

namespace Application.Use_Cases.Commands.TransportCostCommands
{
    public class DeleteTransportCostCommand : IRequest<bool>
    {
        public required Guid TransportCostId { get; set; }

    }
}
