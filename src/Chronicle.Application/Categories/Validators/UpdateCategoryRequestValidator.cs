using Chronicle.Application.Categories.Dtos;
using FluentValidation;

namespace Chronicle.Application.Categories.Validators;

public sealed class UpdateCategoryRequestValidator : AbstractValidator<UpdateCategoryRequest>
{
    public UpdateCategoryRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Description).MaximumLength(500);
    }
}
