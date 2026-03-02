using Application.Use_Cases.Commands.UserCommand;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Use_Cases.Commands.StandManagerCommands
{
    public class CreateStandManagerCommand : UserCommands<Guid>
    {
        public required Guid LocationId { get; set; }
    }
}
