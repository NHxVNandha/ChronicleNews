namespace Chronicle.Application.Engagement.Dtos;

public sealed class SubscriberSummaryResponse
{
    public string Tier { get; init; } = string.Empty;
    public string Count { get; init; } = string.Empty;
    public string Delta { get; init; } = string.Empty;
}
