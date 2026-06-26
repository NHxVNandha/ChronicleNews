using Chronicle.Application.Articles.Dtos;
using FluentValidation;

namespace Chronicle.Application.Articles.Validators;

public sealed class ChangeArticleStatusRequestValidator : AbstractValidator<ChangeArticleStatusRequest>
{
    public ChangeArticleStatusRequestValidator()
    {
        RuleFor(x => x.Status).IsInEnum();
    }
}
