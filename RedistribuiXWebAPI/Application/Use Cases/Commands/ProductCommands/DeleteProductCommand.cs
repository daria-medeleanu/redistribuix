using MediatR;

namespace Application.Use_Cases.Commands.ProductCommands
{
    public class DeleteProductCommand : IRequest<bool>
    {
        public required Guid ProductId { get; set; }
    }
}
