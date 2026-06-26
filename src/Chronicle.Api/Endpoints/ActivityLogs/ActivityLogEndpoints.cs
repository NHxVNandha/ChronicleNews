using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.ActivityLogs;
using Chronicle.Application.ActivityLogs.Dtos;
using Chronicle.Application.Common.Filters;

namespace Chronicle.Api.Endpoints.ActivityLogs;

public static class ActivityLogEndpoints
{
    public static IEndpointRouteBuilder MapActivityLogEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/activity-logs")
            .WithTags("ActivityLogs")
            .RequireAuthorization("AdminOnly");

        group.MapGet("/", GetLogsAsync);

        return app;
    }

    private static async Task<IResult> GetLogsAsync(Guid? userId, string? action, string? entityType, int page, int pageSize, IActivityLogService service, CancellationToken ct)
    {
        var result = await service.GetLogsAsync(new ActivityLogFilter
        {
            UserId = userId,
            Action = action,
            EntityType = entityType,
            Page = page <= 0 ? 1 : page,
            PageSize = pageSize <= 0 ? 20 : pageSize,
        }, ct);

        if (!result.IsSuccess)
        {
            return Results.BadRequest(new ApiErrorResponse
            {
                Error = new ApiError { Code = result.ErrorCode ?? "request_failed", Message = result.ErrorMessage ?? "Request failed." },
            });
        }

        var data = result.Value!;
        return Results.Ok(new PagedResponse<ActivityLogResponse>
        {
            Data = data.Items,
            Meta = new { data.Page, data.PageSize, data.Total },
        });
    }
}
