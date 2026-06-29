using Chronicle.Application.Optimization.Dtos;
using FluentValidation;

namespace Chronicle.Application.Optimization.Validators;

public sealed class UpdateAiSettingsRequestValidator : AbstractValidator<UpdateAiSettingsRequest>
{
    public UpdateAiSettingsRequestValidator()
    {
        RuleFor(x => x.Provider).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ModelName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.BaseUrl).NotEmpty().MaximumLength(255);
        RuleFor(x => x.ApiKeyHint).MaximumLength(100);
        RuleFor(x => x.Temperature).InclusiveBetween(0, 2);
        RuleFor(x => x.MaxTokens).InclusiveBetween(1, 8000);
        RuleFor(x => x.SystemPrompt).NotEmpty().MaximumLength(4000);
        RuleFor(x => x.PrimaryLanguage).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LanguageStandard).NotEmpty().MaximumLength(100);
        RuleFor(x => x.WritingStyle).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Tone).NotEmpty().MaximumLength(100);
    }
}
