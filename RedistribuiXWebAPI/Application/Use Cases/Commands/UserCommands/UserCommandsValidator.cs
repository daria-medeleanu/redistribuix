using FluentValidation;

namespace Application.Use_Cases.Commands.UserCommands
{
    public abstract class UserCommandsValidator<T, U> : AbstractValidator<T> where T : UserCommands<U>
    {
        protected UserCommandsValidator()
        {
            RuleFor(x => x.Name)
                .NotNull().WithMessage("Name is required")
                .NotEmpty().WithMessage("Name cannot be empty.")
                .MaximumLength(30).WithMessage("Name must be at most 30 characters.");


            RuleFor(x => x.Email)
                .NotNull().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");


            RuleFor(x => x.Password)
               .NotNull().WithMessage("Password is required.")
               .MinimumLength(8).WithMessage("Password must be at least 8 characters long.")
               .MaximumLength(100).WithMessage("Password must be at most 100 characters long.")
               .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
               .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter.")
               .Matches(@"[0-9]").WithMessage("Password must contain at least one digit.")
               .Matches(@"[\W_]").WithMessage("Password must contain at least one special character.");
        }

    }
}

