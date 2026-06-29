namespace Chronicle.Application.Media.Dtos;

public sealed class MediaAssetResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public string Size { get; init; } = string.Empty;
    public string Date { get; init; } = string.Empty;
    public string Image { get; init; } = string.Empty;
    public int UsageCount { get; init; }
    public bool AltStatus { get; init; }
    public string Credit { get; init; } = string.Empty;
    public string License { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
}
