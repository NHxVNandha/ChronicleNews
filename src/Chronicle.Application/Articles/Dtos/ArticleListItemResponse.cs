namespace Chronicle.Application.Articles.Dtos;

public sealed class ArticleListItemResponse
{
    public Guid Id { get; init; }
    public string Slug { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Summary { get; init; } = string.Empty;
    public Guid CategoryId { get; init; }
    public string CategoryName { get; init; } = string.Empty;
    public Guid AuthorId { get; init; }
    public string AuthorName { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public bool Featured { get; init; }
    public int Views { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public DateTime? ScheduledAt { get; init; }
    public DateTime? PublishedAt { get; init; }
}
