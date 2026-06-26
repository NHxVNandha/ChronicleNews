using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.Dashboard;
using Chronicle.Application.Dashboard.Dtos;

namespace Chronicle.Api.Endpoints.Dashboard;

public static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard")
            .WithTags("Dashboard")
            .RequireAuthorization("EditorialAccess");

        group.MapGet("/summary", GetSummaryAsync);
        group.MapGet("/pipeline", GetPipelineAsync);
        group.MapGet("/recent-activity", GetRecentActivityAsync);

        return app;
    }

    private static async Task<IResult> GetSummaryAsync(IDashboardService service, CancellationToken ct)
    {
        var result = await service.GetSummaryAsync(ct);
        return Results.Ok(new ApiResponse<DashboardSummaryResponse> { Data = result.Value! });
    }

    private static async Task<IResult> GetPipelineAsync(IDashboardService service, CancellationToken ct)
    {
        var result = await service.GetPipelineAsync(ct);
        return Results.Ok(new ApiResponse<DashboardPipelineResponse> { Data = result.Value! });
    }

    private static async Task<IResult> GetRecentActivityAsync(IDashboardService service, CancellationToken ct)
    {
        var result = await service.GetRecentActivityAsync(ct);
        return Results.Ok(new ApiResponse<IReadOnlyList<DashboardRecentActivityResponse>> { Data = result.Value! });
    }
}
