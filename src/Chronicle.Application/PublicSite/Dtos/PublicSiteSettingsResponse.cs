namespace Chronicle.Application.PublicSite.Dtos;

public sealed class PublicSiteSettingsResponse
{
    public string BrandName { get; init; } = string.Empty;
    public string AboutHeadline { get; init; } = string.Empty;
    public string AboutSummary { get; init; } = string.Empty;
    public string MissionTitle { get; init; } = string.Empty;
    public string MissionBody { get; init; } = string.Empty;
    public string MissionBodySecondary { get; init; } = string.Empty;
    public string EditorialDeskSummary { get; init; } = string.Empty;
    public string ContactHeading { get; init; } = string.Empty;
    public string ContactSummary { get; init; } = string.Empty;
    public string EditorialEmail { get; init; } = string.Empty;
    public string SecureTipLine { get; init; } = string.Empty;
    public string HeadquartersAddress { get; init; } = string.Empty;
}
