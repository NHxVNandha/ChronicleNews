using Chronicle.Application.Common.Results;
using Chronicle.Application.Dashboard.Dtos;

namespace Chronicle.Application.Abstractions.Dashboard;

public interface IDashboardService
{
    Task<Result<DashboardSummaryResponse>> GetSummaryAsync(CancellationToken ct);
    Task<Result<DashboardPipelineResponse>> GetPipelineAsync(CancellationToken ct);
    Task<Result<IReadOnlyList<DashboardRecentActivityResponse>>> GetRecentActivityAsync(CancellationToken ct);
}
