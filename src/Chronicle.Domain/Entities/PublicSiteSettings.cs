using Chronicle.Domain.Common;

namespace Chronicle.Domain.Entities;

public sealed class PublicSiteSettings : AuditableEntity
{
    public string BrandName { get; set; } = string.Empty;
    public string AboutHeadline { get; set; } = string.Empty;
    public string AboutSummary { get; set; } = string.Empty;
    public string MissionTitle { get; set; } = string.Empty;
    public string MissionBody { get; set; } = string.Empty;
    public string MissionBodySecondary { get; set; } = string.Empty;
    public string EditorialDeskSummary { get; set; } = string.Empty;
    public string ContactHeading { get; set; } = string.Empty;
    public string ContactSummary { get; set; } = string.Empty;
    public string EditorialEmail { get; set; } = string.Empty;
    public string SecureTipLine { get; set; } = string.Empty;
    public string HeadquartersAddress { get; set; } = string.Empty;
}
