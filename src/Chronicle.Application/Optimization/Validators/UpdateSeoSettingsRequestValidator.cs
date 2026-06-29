using Chronicle.Application.Optimization.Dtos;
using FluentValidation;

namespace Chronicle.Application.Optimization.Validators;

public sealed class UpdateSeoSettingsRequestValidator : AbstractValidator<UpdateSeoSettingsRequest>
{
    public UpdateSeoSettingsRequestValidator()
    {
        RuleFor(x => x.DefaultMetaTitle).NotEmpty().MaximumLength(250);
        RuleFor(x => x.MetaDescription).NotEmpty().MaximumLength(300);
        RuleFor(x => x.FocusKeyword).MaximumLength(120);
        RuleFor(x => x.RobotsTxt).NotEmpty();
    }
}
