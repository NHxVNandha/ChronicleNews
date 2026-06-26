using FluentValidation;

namespace Chronicle.Application.Auth.Validators;

public sealed class LoginRequestValidator : AbstractValidator<Chronicle.Application.Auth.Dtos.LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty();
    }
}
