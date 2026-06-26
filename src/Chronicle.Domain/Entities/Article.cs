using Chronicle.Domain.Common;
using Chronicle.Domain.Enums;

namespace Chronicle.Domain.Entities;

public sealed class Article : AuditableEntity
{
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public Guid AuthorId { get; set; }
    public ArticleStatus Status { get; set; }
    public bool Featured { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public int Views { get; set; }
    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public DateTime? PublishedAt { get; set; }

    public Category? Category { get; set; }
    public User? Author { get; set; }
    public ICollection<ReviewNote> ReviewNotes { get; set; } = new List<ReviewNote>();
}
