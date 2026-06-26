using FluentValidation;

namespace Chronicle.Application.Auth.Validators;

public sealed class RefreshTokenRequestValidator : AbstractValidator<Chronicle.Application.Auth.Dtos.RefreshTokenRequest>
{
    public RefreshTokenRequestValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty()
            .MaximumLength(500);
    }
}
