using Chronicle.Domain.Common;

namespace Chronicle.Domain.Entities;

public sealed class ReviewNote : BaseEntity
{
    public Guid ArticleId { get; set; }
    public Guid CreatedByUserId { get; set; }
    public string Note { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public Article? Article { get; set; }
    public User? CreatedByUser { get; set; }
}
