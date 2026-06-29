using Chronicle.Application.Engagement.Dtos;
using FluentValidation;

namespace Chronicle.Application.Engagement.Validators;

public sealed class AddCommentReplyRequestValidator : AbstractValidator<AddCommentReplyRequest>
{
    public AddCommentReplyRequestValidator()
    {
        RuleFor(x => x.Text).NotEmpty().MaximumLength(2000);
    }
}
