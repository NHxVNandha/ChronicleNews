using Chronicle.Domain.Enums;

namespace Chronicle.Application.Engagement.Dtos;

public sealed class CreateCampaignRequest
{
    public string Title { get; init; } = string.Empty;
    public CampaignType Type { get; init; }
    public string Audience { get; init; } = string.Empty;
}
