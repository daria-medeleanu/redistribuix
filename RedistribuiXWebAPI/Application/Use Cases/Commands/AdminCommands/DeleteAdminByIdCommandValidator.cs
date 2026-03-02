using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Use_Cases.Commands.AdminCommands
{
    public class DeleteAdminCommandByIdValidator : AbstractValidator<DeleteAdminByIdCommand>
    {
        public DeleteAdminCommandByIdValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}
