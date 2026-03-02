using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.DailySaleCommands
{
    public class UpdateDailySaleCommand : IRequest<Result<Unit>>
    {
        public int Id { get; set; }
        public Guid LocationId { get; set; }
        public Guid ProductId { get; set; }
        public DateTime SaleDate { get; set; }
        public int QuantitySold { get; set; }
    }
}
