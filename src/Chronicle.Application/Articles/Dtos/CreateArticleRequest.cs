using Chronicle.Domain.Enums;

namespace Chronicle.Application.Articles.Dtos;

public sealed class CreateArticleRequest
{
    public string Title { get; init; } = string.Empty;
    public string Summary { get; init; } = string.Empty;
    public string Body { get; init; } = string.Empty;
    public Guid CategoryId { get; init; }
    public bool Featured { get; init; }
    public string? FeaturedImageUrl { get; init; }
    public string? SeoTitle { get; init; }
    public string? SeoDescription { get; init; }
    public ArticleStatus Status { get; init; }
}
