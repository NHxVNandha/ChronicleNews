using Chronicle.Application.Articles.Dtos;
using FluentValidation;

namespace Chronicle.Application.Articles.Validators;

public sealed class ScheduleArticleRequestValidator : AbstractValidator<ScheduleArticleRequest>
{
    public ScheduleArticleRequestValidator()
    {
        RuleFor(x => x.ScheduledAt)
            .Must(x => x > DateTime.UtcNow)
            .WithMessage("ScheduledAt must be in the future.");
    }
}
