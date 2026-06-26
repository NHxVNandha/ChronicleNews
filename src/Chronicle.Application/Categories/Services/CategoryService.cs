using Chronicle.Application.Abstractions.Categories;
using Chronicle.Application.Abstractions.Identity;
using Chronicle.Application.Abstractions.Persistence;
using Chronicle.Application.Categories.Dtos;
using Chronicle.Application.Common.Results;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Chronicle.Application.Categories.Services;

public sealed class CategoryService(
    IAppDbContext dbContext,
    ICurrentUserService currentUserService,
    IValidator<CreateCategoryRequest> createValidator,
    IValidator<UpdateCategoryRequest> updateValidator) : ICategoryService
{
    public async Task<Result<IReadOnlyList<CategoryResponse>>> GetCategoriesAsync(CancellationToken ct)
    {
        var categories = await dbContext.Categories
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .Select(x => Map(x))
            .ToListAsync(ct);

        return Result<IReadOnlyList<CategoryResponse>>.Success(categories);
    }

    public async Task<Result<CategoryResponse>> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var category = await dbContext.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        return category is null
            ? Result<CategoryResponse>.Failure("not_found", "Category was not found.")
            : Result<CategoryResponse>.Success(Map(category));
    }

    public async Task<Result<CategoryResponse>> CreateAsync(CreateCategoryRequest request, CancellationToken ct)
    {
        var validation = await createValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<CategoryResponse>.Failure("validation_error", "Create category request is invalid.", ToValidationErrors(validation));
        }

        var now = DateTime.UtcNow;
        var category = new Chronicle.Domain.Entities.Category
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Slug = await GenerateUniqueSlugAsync(request.Name, ct),
            Description = request.Description?.Trim(),
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now,
        };

        await dbContext.Categories.AddAsync(category, ct);
        await WriteActivityLogAsync("category_created", "Category", category.Id.ToString(), $"Created category \"{category.Name}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result<CategoryResponse>.Success(Map(category));
    }

    public async Task<Result<CategoryResponse>> UpdateAsync(Guid id, UpdateCategoryRequest request, CancellationToken ct)
    {
        var validation = await updateValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<CategoryResponse>.Failure("validation_error", "Update category request is invalid.", ToValidationErrors(validation));
        }

        var category = await dbContext.Categories.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (category is null)
        {
            return Result<CategoryResponse>.Failure("not_found", "Category was not found.");
        }

        var normalizedName = request.Name.Trim();
        if (!string.Equals(category.Name, normalizedName, StringComparison.Ordinal))
        {
            category.Slug = await GenerateUniqueSlugAsync(normalizedName, ct, category.Id);
        }

        category.Name = normalizedName;
        category.Description = request.Description?.Trim();
        category.IsActive = request.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        await WriteActivityLogAsync("category_updated", "Category", category.Id.ToString(), $"Updated category \"{category.Name}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result<CategoryResponse>.Success(Map(category));
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken ct)
    {
        var category = await dbContext.Categories.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (category is null)
        {
            return Result.Failure("not_found", "Category was not found.");
        }

        var isInUse = await dbContext.Articles.AnyAsync(x => x.CategoryId == id, ct);
        if (isInUse)
        {
            return Result.Failure("category_in_use", "Category cannot be deleted because it is still used by articles.");
        }

        dbContext.Categories.Remove(category);
        await WriteActivityLogAsync("category_deleted", "Category", category.Id.ToString(), $"Deleted category \"{category.Name}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result.Success();
    }

    private static CategoryResponse Map(Chronicle.Domain.Entities.Category category) => new()
    {
        Id = category.Id,
        Name = category.Name,
        Slug = category.Slug,
        Description = category.Description,
        IsActive = category.IsActive,
        CreatedAt = category.CreatedAt,
        UpdatedAt = category.UpdatedAt,
    };

    private async Task<string> GenerateUniqueSlugAsync(string name, CancellationToken ct, Guid? currentId = null)
    {
        var baseSlug = Slugify(name);
        var slug = baseSlug;
        var counter = 2;

        while (await dbContext.Categories.AnyAsync(x => x.Slug == slug && (!currentId.HasValue || x.Id != currentId.Value), ct))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
    }

    private async Task WriteActivityLogAsync(string action, string entityType, string? entityId, string description, CancellationToken ct)
    {
        var currentUser = currentUserService.GetCurrentUser();
        await dbContext.ActivityLogs.AddAsync(new Chronicle.Domain.Entities.ActivityLog
        {
            Id = Guid.NewGuid(),
            UserId = currentUser.UserId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Description = description,
            CreatedAt = DateTime.UtcNow,
        }, ct);
    }

    private static string Slugify(string value)
    {
        var slug = value.Trim().ToLowerInvariant().Replace("&", "and");
        slug = Regex.Replace(slug, "[^a-z0-9]+", "-");
        slug = Regex.Replace(slug, "-+", "-");
        return slug.Trim('-');
    }

    private static Dictionary<string, string[]> ToValidationErrors(FluentValidation.Results.ValidationResult validation)
        => validation.Errors.GroupBy(x => x.PropertyName).ToDictionary(x => x.Key, x => x.Select(v => v.ErrorMessage).ToArray());
}
