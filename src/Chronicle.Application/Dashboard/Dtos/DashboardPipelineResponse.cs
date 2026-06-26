namespace Chronicle.Application.Dashboard.Dtos;

public sealed class DashboardPipelineResponse
{
    public int Draft { get; init; }
    public int NeedsReview { get; init; }
    public int Scheduled { get; init; }
    public int Published { get; init; }
}
