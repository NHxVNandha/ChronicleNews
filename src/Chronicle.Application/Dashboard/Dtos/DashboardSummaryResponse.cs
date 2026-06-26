namespace Chronicle.Application.Dashboard.Dtos;

public sealed class DashboardSummaryResponse
{
    public int PublishedArticles { get; init; }
    public int DraftQueue { get; init; }
    public int MediaAssets { get; init; }
    public int MonthlyReaders { get; init; }
}
