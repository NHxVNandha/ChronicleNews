namespace Chronicle.Application.Articles.Dtos;

public sealed class ReviewNoteResponse
{
    public Guid Id { get; init; }
    public Guid ArticleId { get; init; }
    public Guid CreatedByUserId { get; init; }
    public string CreatedByName { get; init; } = string.Empty;
    public string Note { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}
