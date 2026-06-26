using Chronicle.Application.Articles.Dtos;
using FluentValidation;

namespace Chronicle.Application.Articles.Validators;

public sealed class CreateArticleRequestValidator : AbstractValidator<CreateArticleRequest>
{
    public CreateArticleRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(250);
        RuleFor(x => x.Summary).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.Body).NotEmpty();
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.FeaturedImageUrl).MaximumLength(500);
        RuleFor(x => x.SeoTitle).MaximumLength(250);
        RuleFor(x => x.SeoDescription).MaximumLength(300);
        RuleFor(x => x.Status).IsInEnum();
    }
}
