using Chronicle.Domain.Common;
using Chronicle.Domain.Enums;

namespace Chronicle.Domain.Entities;

public sealed class Campaign : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public CampaignType Type { get; set; }
    public string Audience { get; set; } = string.Empty;
    public CampaignStatus Status { get; set; }
    public string? OpenRate { get; set; }
    public DateTime? SentAt { get; set; }
}
