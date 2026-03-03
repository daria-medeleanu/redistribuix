using MediatR;

namespace Application.Use_Cases.Commands.PhoneModelCommands
{
    public class DeletePhoneModelCommand : IRequest<bool>
    {
        public required Guid ModelId { get; set; }
    }
}
