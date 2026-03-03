using Domain.Enums;
using MediatR;

namespace Application.Use_Cases.Commands.PhoneModelCommands
{
    public class UpdatePhoneModelCommand : IRequest<bool>
    {
        public required Guid ModelId { get; set; }
        public required string ModelName { get; set; }
        public LifeStatus LifeStatus { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
}
