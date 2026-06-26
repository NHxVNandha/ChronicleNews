namespace Chronicle.Application.Dashboard.Dtos;

public sealed class DashboardRecentActivityResponse
{
    public string Action { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string User { get; init; } = string.Empty;
    public DateTime Time { get; init; }
}
