using Chronicle.Application.Categories.Dtos;
using Chronicle.Application.Common.Results;

namespace Chronicle.Application.Abstractions.Categories;

public interface ICategoryService
{
    Task<Result<IReadOnlyList<CategoryResponse>>> GetCategoriesAsync(CancellationToken ct);
    Task<Result<CategoryResponse>> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Result<CategoryResponse>> CreateAsync(CreateCategoryRequest request, CancellationToken ct);
    Task<Result<CategoryResponse>> UpdateAsync(Guid id, UpdateCategoryRequest request, CancellationToken ct);
    Task<Result> DeleteAsync(Guid id, CancellationToken ct);
}
