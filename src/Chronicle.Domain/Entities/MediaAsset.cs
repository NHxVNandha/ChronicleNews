using Chronicle.Domain.Common;

namespace Chronicle.Domain.Entities;

public sealed class MediaAsset : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string SizeLabel { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int UsageCount { get; set; }
    public bool HasAltText { get; set; }
    public string Credit { get; set; } = string.Empty;
    public string License { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}
