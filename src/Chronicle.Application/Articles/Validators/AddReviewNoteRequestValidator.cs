using Chronicle.Application.Articles.Dtos;
using FluentValidation;

namespace Chronicle.Application.Articles.Validators;

public sealed class AddReviewNoteRequestValidator : AbstractValidator<AddReviewNoteRequest>
{
    public AddReviewNoteRequestValidator()
    {
        RuleFor(x => x.Note).NotEmpty().MaximumLength(2000);
    }
}
