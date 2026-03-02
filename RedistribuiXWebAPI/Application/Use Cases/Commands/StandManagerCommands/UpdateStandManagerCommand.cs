using Application.Use_Cases.Commands.UserCommand;
using System;

namespace Application.Use_Cases.Commands.StandManagerCommands
{
    public class UpdateStandManagerCommand : UserCommands<Guid>
    {
        public Guid LocationId { get; set; }
        // Add other properties if needed for update
    }
}
