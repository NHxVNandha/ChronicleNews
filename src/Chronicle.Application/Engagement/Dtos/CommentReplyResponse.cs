namespace Chronicle.Application.Engagement.Dtos;

public sealed class CommentReplyResponse
{
    public Guid Id { get; init; }
    public string Author { get; init; } = string.Empty;
    public string Text { get; init; } = string.Empty;
    public string Date { get; init; } = string.Empty;
}
