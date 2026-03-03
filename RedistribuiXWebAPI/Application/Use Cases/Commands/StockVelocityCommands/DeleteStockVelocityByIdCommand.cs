using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.StockVelocityCommands
{
    public record DeleteStockVelocityByIdCommand(Guid Id) : IRequest<Result<Unit>>;
}
