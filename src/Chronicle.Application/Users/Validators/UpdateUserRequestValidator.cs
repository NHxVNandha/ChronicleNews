using Chronicle.Application.Users.Dtos;
using FluentValidation;

namespace Chronicle.Application.Users.Validators;

public sealed class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(150);
        RuleFor(x => x.RoleId).NotEmpty();
    }
}
