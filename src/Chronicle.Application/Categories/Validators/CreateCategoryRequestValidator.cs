using Chronicle.Application.Categories.Dtos;
using FluentValidation;

namespace Chronicle.Application.Categories.Validators;

public sealed class CreateCategoryRequestValidator : AbstractValidator<CreateCategoryRequest>
{
    public CreateCategoryRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Description).MaximumLength(500);
    }
}
