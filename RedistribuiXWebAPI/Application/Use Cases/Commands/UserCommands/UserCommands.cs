using MediatR;
using Domain.Common;
namespace Application.Use_Cases.Commands.UserCommands
{
    public abstract class UserCommands<T> : IRequest<Result<T>>
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
