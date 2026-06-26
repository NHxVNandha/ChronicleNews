using Chronicle.Domain.Enums;

namespace Chronicle.Application.Common.Filters;

public sealed class ArticleListFilter
{
    public string? Query { get; init; }
    public Guid? CategoryId { get; init; }
    public ArticleStatus? Status { get; init; }
    public Guid? AuthorId { get; init; }
    public bool? Featured { get; init; }
    public string? Sort { get; init; } = "newest";
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
