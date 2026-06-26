using Chronicle.Application.Users.Dtos;
using FluentValidation;

namespace Chronicle.Application.Users.Validators;

public sealed class ChangeUserStatusRequestValidator : AbstractValidator<ChangeUserStatusRequest>
{
    public ChangeUserStatusRequestValidator()
    {
        RuleFor(x => x.Status).IsInEnum();
    }
}
