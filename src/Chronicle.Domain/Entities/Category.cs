using Chronicle.Domain.Common;

namespace Chronicle.Domain.Entities;

public sealed class Category : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }

    public ICollection<Article> Articles { get; set; } = new List<Article>();
}
