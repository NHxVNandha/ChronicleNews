using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.Engagement;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Engagement.Dtos;
using Chronicle.Domain.Enums;

namespace Chronicle.Api.Endpoints.Engagement;

public static class EngagementEndpoints
{
    public static IEndpointRouteBuilder MapEngagementEndpoints(this IEndpointRouteBuilder app)
    {
        var comments = app.MapGroup("/api/comments").WithTags("Comments").RequireAuthorization("ReviewerOrBetter");
        comments.MapGet("/", GetCommentsAsync);
        comments.MapPatch("/{id:guid}/status", ChangeCommentStatusAsync);
        comments.MapPost("/{id:guid}/reply", AddReplyAsync);

        var campaigns = app.MapGroup("/api/campaigns").WithTags("Campaigns").RequireAuthorization("EditorialAccess");
        campaigns.MapGet("/", GetCampaignsAsync);
        campaigns.MapPost("/", CreateCampaignAsync);

        var subscribers = app.MapGroup("/api/subscribers").WithTags("Subscribers").RequireAuthorization("EditorialAccess");
        subscribers.MapGet("/summary", GetSubscriberSummaryAsync);

        return app;
    }

    private static async Task<IResult> GetCommentsAsync(CommentStatus? status, IEngagementService service, CancellationToken ct)
        => ToHttpResult(await service.GetCommentsAsync(status, ct));

    private static async Task<IResult> ChangeCommentStatusAsync(Guid id, ChangeCommentStatusRequest request, IEngagementService service, CancellationToken ct)
        => ToHttpResult(await service.ChangeCommentStatusAsync(id, request, ct));

    private static async Task<IResult> AddReplyAsync(Guid id, AddCommentReplyRequest request, IEngagementService service, CancellationToken ct)
        => ToHttpResult(await service.AddReplyAsync(id, request, ct), isCreated: true);

    private static async Task<IResult> GetCampaignsAsync(IEngagementService service, CancellationToken ct)
        => ToHttpResult(await service.GetCampaignsAsync(ct));

    private static async Task<IResult> CreateCampaignAsync(CreateCampaignRequest request, IEngagementService service, CancellationToken ct)
        => ToHttpResult(await service.CreateCampaignAsync(request, ct), isCreated: true);

    private static async Task<IResult> GetSubscriberSummaryAsync(IEngagementService service, CancellationToken ct)
        => ToHttpResult(await service.GetSubscriberSummaryAsync(ct));

    private static IResult ToHttpResult(Result result)
        => result.IsSuccess ? Results.Ok(new ApiResponse<string> { Data = "ok" }) : ToErrorResult(result);

    private static IResult ToHttpResult<T>(Result<T> result, bool isCreated = false)
        => result.IsSuccess
            ? isCreated
                ? Results.Created(string.Empty, new ApiResponse<T> { Data = result.Value! })
                : Results.Ok(new ApiResponse<T> { Data = result.Value! })
            : ToErrorResult(result);

    private static IResult ToErrorResult(Result result)
    {
        var payload = new ApiErrorResponse
        {
            Error = new ApiError
            {
                Code = result.ErrorCode ?? "request_failed",
                Message = result.ErrorMessage ?? "Request failed.",
                Details = result.ValidationErrors,
            },
        };

        return result.ErrorCode switch
        {
            "validation_error" => Results.BadRequest(payload),
            "not_found" => Results.Json(payload, statusCode: StatusCodes.Status404NotFound),
            _ => Results.BadRequest(payload),
        };
    }
}
