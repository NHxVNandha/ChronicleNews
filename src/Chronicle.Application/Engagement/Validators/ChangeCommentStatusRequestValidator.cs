using Chronicle.Application.Engagement.Dtos;
using FluentValidation;

namespace Chronicle.Application.Engagement.Validators;

public sealed class ChangeCommentStatusRequestValidator : AbstractValidator<ChangeCommentStatusRequest>
{
    public ChangeCommentStatusRequestValidator()
    {
        RuleFor(x => x.Status).IsInEnum();
    }
}
