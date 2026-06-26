using Chronicle.Application.Articles.Dtos;
using Chronicle.Application.Common.Filters;
using Chronicle.Application.Common.Models;
using Chronicle.Application.Common.Results;

namespace Chronicle.Application.Abstractions.Articles;

public interface IArticleService
{
    Task<Result<PagedResult<ArticleListItemResponse>>> GetArticlesAsync(ArticleListFilter filter, CancellationToken ct);
    Task<Result<ArticleDetailResponse>> GetBySlugAsync(string slug, CancellationToken ct);
    Task<Result<ArticleDetailResponse>> CreateAsync(CreateArticleRequest request, CancellationToken ct);
    Task<Result<ArticleDetailResponse>> UpdateAsync(Guid id, UpdateArticleRequest request, CancellationToken ct);
    Task<Result> DeleteAsync(Guid id, CancellationToken ct);
    Task<Result> ChangeStatusAsync(Guid id, ChangeArticleStatusRequest request, CancellationToken ct);
    Task<Result> ScheduleAsync(Guid id, ScheduleArticleRequest request, CancellationToken ct);
    Task<Result<IReadOnlyList<ArticleListItemResponse>>> GetReviewQueueAsync(CancellationToken ct);
    Task<Result<IReadOnlyList<ReviewNoteResponse>>> GetReviewNotesAsync(Guid articleId, CancellationToken ct);
    Task<Result<ReviewNoteResponse>> AddReviewNoteAsync(Guid articleId, AddReviewNoteRequest request, CancellationToken ct);
}
