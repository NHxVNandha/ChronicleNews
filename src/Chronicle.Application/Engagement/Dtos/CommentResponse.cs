namespace Chronicle.Application.Engagement.Dtos;

public sealed class CommentResponse
{
    public Guid Id { get; init; }
    public string Text { get; init; } = string.Empty;
    public string ArticleTitle { get; init; } = string.Empty;
    public string Author { get; init; } = string.Empty;
    public string Date { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public IReadOnlyList<CommentReplyResponse> Replies { get; init; } = [];
}
