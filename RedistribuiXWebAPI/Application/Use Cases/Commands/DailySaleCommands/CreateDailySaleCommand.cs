using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.DailySaleCommands
{
    public class CreateDailySaleCommand : IRequest<Result<int>>
    {
        public Guid LocationId { get; set; }
        public Guid ProductId { get; set; }
        public DateTime SaleDate { get; set; }
        public int QuantitySold { get; set; }
    }
}
