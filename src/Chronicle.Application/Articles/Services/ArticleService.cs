using Chronicle.Application.Abstractions.Articles;
using Chronicle.Application.Abstractions.Identity;
using Chronicle.Application.Abstractions.Persistence;
using Chronicle.Application.Articles.Dtos;
using Chronicle.Application.Articles.Validators;
using Chronicle.Application.Common.Filters;
using Chronicle.Application.Common.Models;
using Chronicle.Application.Common.Results;
using Chronicle.Domain.Entities;
using Chronicle.Domain.Enums;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Chronicle.Application.Articles.Services;

public sealed class ArticleService(
    IAppDbContext dbContext,
    ICurrentUserService currentUserService,
    IValidator<CreateArticleRequest> createValidator,
    IValidator<UpdateArticleRequest> updateValidator,
    IValidator<ChangeArticleStatusRequest> statusValidator,
    IValidator<ScheduleArticleRequest> scheduleValidator,
    IValidator<AddReviewNoteRequest> reviewNoteValidator) : IArticleService
{
    public async Task<Result<PagedResult<ArticleListItemResponse>>> GetArticlesAsync(ArticleListFilter filter, CancellationToken ct)
    {
        var page = Math.Max(filter.Page, 1);
        var pageSize = Math.Clamp(filter.PageSize, 1, 100);

        var query = dbContext.Articles
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Author)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Query))
        {
            var q = filter.Query.Trim().ToLowerInvariant();
            query = query.Where(x => x.Title.ToLower().Contains(q) || x.Summary.ToLower().Contains(q));
        }

        if (filter.CategoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == filter.CategoryId.Value);
        }

        if (filter.Status.HasValue)
        {
            query = query.Where(x => x.Status == filter.Status.Value);
        }

        if (filter.AuthorId.HasValue)
        {
            query = query.Where(x => x.AuthorId == filter.AuthorId.Value);
        }

        if (filter.Featured.HasValue)
        {
            query = query.Where(x => x.Featured == filter.Featured.Value);
        }

        query = (filter.Sort ?? "newest").ToLowerInvariant() switch
        {
            "oldest" => query.OrderBy(x => x.CreatedAt),
            "popular" => query.OrderByDescending(x => x.Views).ThenByDescending(x => x.UpdatedAt),
            _ => query.OrderByDescending(x => x.CreatedAt),
        };

        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => MapListItem(x))
            .ToListAsync(ct);

        return Result<PagedResult<ArticleListItemResponse>>.Success(new PagedResult<ArticleListItemResponse>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            Total = total,
        });
    }

    public async Task<Result<ArticleDetailResponse>> GetBySlugAsync(string slug, CancellationToken ct)
    {
        var article = await dbContext.Articles
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Author)
            .FirstOrDefaultAsync(x => x.Slug == slug, ct);

        return article is null
            ? Result<ArticleDetailResponse>.Failure("not_found", "Article was not found.")
            : Result<ArticleDetailResponse>.Success(MapDetail(article));
    }

    public async Task<Result<ArticleDetailResponse>> CreateAsync(CreateArticleRequest request, CancellationToken ct)
    {
        var validation = await createValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<ArticleDetailResponse>.Failure("validation_error", "Create article request is invalid.", ToValidationErrors(validation));
        }

        var currentUser = currentUserService.GetCurrentUser();
        if (!currentUser.IsAuthenticated || currentUser.UserId is null)
        {
            return Result<ArticleDetailResponse>.Failure("unauthorized", "Authentication is required.");
        }

        var category = await dbContext.Categories.FirstOrDefaultAsync(x => x.Id == request.CategoryId, ct);
        if (category is null)
        {
            return Result<ArticleDetailResponse>.Failure("category_not_found", "Selected category was not found.");
        }

        var author = await dbContext.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Id == currentUser.UserId.Value, ct);
        if (author is null || author.Role is null)
        {
            return Result<ArticleDetailResponse>.Failure("user_not_found", "Current user was not found.");
        }

        if (string.Equals(author.Role.Name, "Author", StringComparison.OrdinalIgnoreCase)
            && request.Status is ArticleStatus.Published or ArticleStatus.Scheduled or ArticleStatus.Archived)
        {
            return Result<ArticleDetailResponse>.Failure("forbidden_status", "Authors cannot create articles directly in the requested status.");
        }

        var now = DateTime.UtcNow;
        var article = new Article
        {
            Id = Guid.NewGuid(),
            Slug = await GenerateUniqueSlugAsync(request.Title, ct),
            Title = request.Title.Trim(),
            Summary = request.Summary.Trim(),
            Body = request.Body,
            CategoryId = category.Id,
            AuthorId = author.Id,
            Status = request.Status,
            Featured = request.Featured,
            FeaturedImageUrl = request.FeaturedImageUrl?.Trim(),
            Views = 0,
            SeoTitle = request.SeoTitle?.Trim(),
            SeoDescription = request.SeoDescription?.Trim(),
            CreatedAt = now,
            UpdatedAt = now,
            PublishedAt = request.Status == ArticleStatus.Published ? now : null,
        };

        await dbContext.Articles.AddAsync(article, ct);
        await WriteActivityLogAsync("article_created", "Article", article.Id.ToString(), $"Created article \"{article.Title}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        article.Category = category;
        article.Author = author;
        return Result<ArticleDetailResponse>.Success(MapDetail(article));
    }

    public async Task<Result<ArticleDetailResponse>> UpdateAsync(Guid id, UpdateArticleRequest request, CancellationToken ct)
    {
        var validation = await updateValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<ArticleDetailResponse>.Failure("validation_error", "Update article request is invalid.", ToValidationErrors(validation));
        }

        var currentUser = currentUserService.GetCurrentUser();
        if (!currentUser.IsAuthenticated || currentUser.UserId is null)
        {
            return Result<ArticleDetailResponse>.Failure("unauthorized", "Authentication is required.");
        }

        var article = await dbContext.Articles
            .Include(x => x.Category)
            .Include(x => x.Author)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (article is null)
        {
            return Result<ArticleDetailResponse>.Failure("not_found", "Article was not found.");
        }

        var currentRole = currentUser.Role;
        var canEditAny = string.Equals(currentRole, "Admin", StringComparison.OrdinalIgnoreCase) || string.Equals(currentRole, "Editor", StringComparison.OrdinalIgnoreCase);
        if (!canEditAny && article.AuthorId != currentUser.UserId.Value)
        {
            return Result<ArticleDetailResponse>.Failure("forbidden", "You cannot edit this article.");
        }

        var category = await dbContext.Categories.FirstOrDefaultAsync(x => x.Id == request.CategoryId, ct);
        if (category is null)
        {
            return Result<ArticleDetailResponse>.Failure("category_not_found", "Selected category was not found.");
        }

        var oldTitle = article.Title;
        article.Title = request.Title.Trim();
        article.Summary = request.Summary.Trim();
        article.Body = request.Body;
        article.CategoryId = category.Id;
        article.Category = category;
        article.Featured = request.Featured;
        article.FeaturedImageUrl = request.FeaturedImageUrl?.Trim();
        article.SeoTitle = request.SeoTitle?.Trim();
        article.SeoDescription = request.SeoDescription?.Trim();
        article.UpdatedAt = DateTime.UtcNow;

        if (article.Status == ArticleStatus.Draft && !string.Equals(oldTitle, article.Title, StringComparison.Ordinal))
        {
            article.Slug = await GenerateUniqueSlugAsync(article.Title, ct, article.Id);
        }

        await WriteActivityLogAsync("article_updated", "Article", article.Id.ToString(), $"Updated article \"{article.Title}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result<ArticleDetailResponse>.Success(MapDetail(article));
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken ct)
    {
        var article = await dbContext.Articles.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (article is null)
        {
            return Result.Failure("not_found", "Article was not found.");
        }

        dbContext.Articles.Remove(article);
        await WriteActivityLogAsync("article_deleted", "Article", article.Id.ToString(), $"Deleted article \"{article.Title}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result.Success();
    }

    public async Task<Result> ChangeStatusAsync(Guid id, ChangeArticleStatusRequest request, CancellationToken ct)
    {
        var validation = await statusValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result.Failure("validation_error", "Change status request is invalid.", ToValidationErrors(validation));
        }

        var article = await dbContext.Articles.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (article is null)
        {
            return Result.Failure("not_found", "Article was not found.");
        }

        var currentUser = currentUserService.GetCurrentUser();
        if (!ArticleWorkflowPolicy.CanTransition(article.Status, request.Status, currentUser.Role))
        {
            return Result.Failure("invalid_status_transition", "The requested status transition is not allowed.");
        }

        article.Status = request.Status;
        article.UpdatedAt = DateTime.UtcNow;

        if (request.Status == ArticleStatus.Published)
        {
            article.PublishedAt = DateTime.UtcNow;
            article.ScheduledAt = null;
        }
        else if (request.Status == ArticleStatus.Archived)
        {
            article.ScheduledAt = null;
        }

        await WriteActivityLogAsync("article_status_changed", "Article", article.Id.ToString(), $"Changed article status to {article.Status}.", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result.Success();
    }

    public async Task<Result> ScheduleAsync(Guid id, ScheduleArticleRequest request, CancellationToken ct)
    {
        var validation = await scheduleValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result.Failure("validation_error", "Schedule article request is invalid.", ToValidationErrors(validation));
        }

        var article = await dbContext.Articles.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (article is null)
        {
            return Result.Failure("not_found", "Article was not found.");
        }

        article.ScheduledAt = request.ScheduledAt;
        article.Status = ArticleStatus.Scheduled;
        article.UpdatedAt = DateTime.UtcNow;

        await WriteActivityLogAsync("article_scheduled", "Article", article.Id.ToString(), $"Scheduled article \"{article.Title}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result.Success();
    }

    public async Task<Result<IReadOnlyList<ArticleListItemResponse>>> GetReviewQueueAsync(CancellationToken ct)
    {
        var items = await dbContext.Articles
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Author)
            .Where(x => x.Status == ArticleStatus.NeedsReview)
            .OrderByDescending(x => x.UpdatedAt)
            .Select(x => MapListItem(x))
            .ToListAsync(ct);

        return Result<IReadOnlyList<ArticleListItemResponse>>.Success(items);
    }

    public async Task<Result<IReadOnlyList<ReviewNoteResponse>>> GetReviewNotesAsync(Guid articleId, CancellationToken ct)
    {
        var articleExists = await dbContext.Articles.AnyAsync(x => x.Id == articleId, ct);
        if (!articleExists)
        {
            return Result<IReadOnlyList<ReviewNoteResponse>>.Failure("not_found", "Article was not found.");
        }

        var notes = await dbContext.ReviewNotes
            .AsNoTracking()
            .Include(x => x.CreatedByUser)
            .Where(x => x.ArticleId == articleId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new ReviewNoteResponse
            {
                Id = x.Id,
                ArticleId = x.ArticleId,
                CreatedByUserId = x.CreatedByUserId,
                CreatedByName = x.CreatedByUser!.FullName,
                Note = x.Note,
                CreatedAt = x.CreatedAt,
            })
            .ToListAsync(ct);

        return Result<IReadOnlyList<ReviewNoteResponse>>.Success(notes);
    }

    public async Task<Result<ReviewNoteResponse>> AddReviewNoteAsync(Guid articleId, AddReviewNoteRequest request, CancellationToken ct)
    {
        var validation = await reviewNoteValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<ReviewNoteResponse>.Failure("validation_error", "Add review note request is invalid.", ToValidationErrors(validation));
        }

        var article = await dbContext.Articles.FirstOrDefaultAsync(x => x.Id == articleId, ct);
        if (article is null)
        {
            return Result<ReviewNoteResponse>.Failure("not_found", "Article was not found.");
        }

        var currentUser = currentUserService.GetCurrentUser();
        if (!currentUser.IsAuthenticated || currentUser.UserId is null)
        {
            return Result<ReviewNoteResponse>.Failure("unauthorized", "Authentication is required.");
        }

        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == currentUser.UserId.Value, ct);
        if (user is null)
        {
            return Result<ReviewNoteResponse>.Failure("user_not_found", "Current user was not found.");
        }

        var note = new ReviewNote
        {
            Id = Guid.NewGuid(),
            ArticleId = articleId,
            CreatedByUserId = user.Id,
            Note = request.Note.Trim(),
            CreatedAt = DateTime.UtcNow,
            CreatedByUser = user,
        };

        await dbContext.ReviewNotes.AddAsync(note, ct);
        await WriteActivityLogAsync("review_note_added", "ReviewNote", note.Id.ToString(), $"Added review note to article \"{article.Title}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result<ReviewNoteResponse>.Success(new ReviewNoteResponse
        {
            Id = note.Id,
            ArticleId = note.ArticleId,
            CreatedByUserId = note.CreatedByUserId,
            CreatedByName = user.FullName,
            Note = note.Note,
            CreatedAt = note.CreatedAt,
        });
    }

    private static ArticleListItemResponse MapListItem(Article article) => new()
    {
        Id = article.Id,
        Slug = article.Slug,
        Title = article.Title,
        Summary = article.Summary,
        CategoryId = article.CategoryId,
        CategoryName = article.Category!.Name,
        AuthorId = article.AuthorId,
        AuthorName = article.Author!.FullName,
        Status = article.Status.ToString(),
        Featured = article.Featured,
        Views = article.Views,
        CreatedAt = article.CreatedAt,
        UpdatedAt = article.UpdatedAt,
        ScheduledAt = article.ScheduledAt,
        PublishedAt = article.PublishedAt,
    };

    private static ArticleDetailResponse MapDetail(Article article) => new()
    {
        Id = article.Id,
        Slug = article.Slug,
        Title = article.Title,
        Summary = article.Summary,
        Body = article.Body,
        CategoryId = article.CategoryId,
        CategoryName = article.Category?.Name ?? string.Empty,
        AuthorId = article.AuthorId,
        AuthorName = article.Author?.FullName ?? string.Empty,
        Status = article.Status.ToString(),
        Featured = article.Featured,
        FeaturedImageUrl = article.FeaturedImageUrl,
        Views = article.Views,
        SeoTitle = article.SeoTitle,
        SeoDescription = article.SeoDescription,
        CreatedAt = article.CreatedAt,
        UpdatedAt = article.UpdatedAt,
        ScheduledAt = article.ScheduledAt,
        PublishedAt = article.PublishedAt,
    };

    private async Task WriteActivityLogAsync(string action, string entityType, string? entityId, string description, CancellationToken ct)
    {
        var currentUser = currentUserService.GetCurrentUser();
        await dbContext.ActivityLogs.AddAsync(new ActivityLog
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

    private async Task<string> GenerateUniqueSlugAsync(string title, CancellationToken ct, Guid? currentId = null)
    {
        var baseSlug = Slugify(title);
        var slug = baseSlug;
        var counter = 2;

        while (await dbContext.Articles.AnyAsync(x => x.Slug == slug && (!currentId.HasValue || x.Id != currentId.Value), ct))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
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
