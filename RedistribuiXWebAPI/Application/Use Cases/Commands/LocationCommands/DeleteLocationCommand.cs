using MediatR;

namespace Application.Use_Cases.Commands.LocationCommands
{
    public class DeleteLocationCommand : IRequest<bool>
    {
        public required Guid LocationId { get; set; }
    }
}
