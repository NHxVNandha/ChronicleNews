namespace Chronicle.Application.Categories.Dtos;

public sealed class UpdateCategoryRequest
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public bool IsActive { get; init; }
}
