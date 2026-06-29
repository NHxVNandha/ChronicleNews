using Chronicle.Application.Engagement.Dtos;
using FluentValidation;

namespace Chronicle.Application.Engagement.Validators;

public sealed class CreateCampaignRequestValidator : AbstractValidator<CreateCampaignRequest>
{
    public CreateCampaignRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(255);
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.Audience).NotEmpty().MaximumLength(150);
    }
}
