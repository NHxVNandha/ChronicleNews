namespace Chronicle.Application.Engagement.Dtos;

public sealed class CampaignResponse
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
    public string Sent { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string? OpenRate { get; init; }
}
