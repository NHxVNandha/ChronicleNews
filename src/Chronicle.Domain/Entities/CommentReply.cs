using Chronicle.Domain.Common;

namespace Chronicle.Domain.Entities;

public sealed class CommentReply : BaseEntity
{
    public Guid CommentId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public Comment? Comment { get; set; }
}
