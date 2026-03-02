using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.StockVelocityCommands
{
    public class CreateStockVelocityCommand : IRequest<Result<Guid>>
    {
        public Guid LocationId { get; set; }
        public Guid ProductId { get; set; }

        public int CurrentQuantity { get; set; }
        public int SalesLast30Days { get; set; }
        public int SalesLast100Days { get; set; }

        public DateTime LastInboundDate { get; set; }
        public DateTime LastInventoryDate { get; set; }
    }
}
