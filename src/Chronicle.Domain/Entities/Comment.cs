using Chronicle.Domain.Common;
using Chronicle.Domain.Enums;

namespace Chronicle.Domain.Entities;

public sealed class Comment : BaseEntity
{
    public Guid ArticleId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public CommentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public Article? Article { get; set; }
    public ICollection<CommentReply> Replies { get; set; } = new List<CommentReply>();
}
