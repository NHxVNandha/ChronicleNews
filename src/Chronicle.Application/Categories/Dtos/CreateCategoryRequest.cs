namespace Chronicle.Application.Categories.Dtos;

public sealed class CreateCategoryRequest
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
}
