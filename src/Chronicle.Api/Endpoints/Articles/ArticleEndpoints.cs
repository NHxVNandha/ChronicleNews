using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.Articles;
using Chronicle.Application.Articles.Dtos;
using Chronicle.Application.Common.Filters;
using Chronicle.Application.Common.Results;

namespace Chronicle.Api.Endpoints.Articles;

public static class ArticleEndpoints
{
    public static IEndpointRouteBuilder MapArticleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/articles").WithTags("Articles");

        group.MapGet("/", GetArticlesAsync).AllowAnonymous();
        group.MapGet("/review-queue", GetReviewQueueAsync).RequireAuthorization("ReviewerOrBetter");
        group.MapGet("/{slug}", GetArticleBySlugAsync).AllowAnonymous();
        group.MapPost("/", CreateArticleAsync).RequireAuthorization("AuthorOrBetter");
        group.MapPut("/{id:guid}", UpdateArticleAsync).RequireAuthorization("AuthorOrBetter");
        group.MapDelete("/{id:guid}", DeleteArticleAsync).RequireAuthorization("EditorOrAdmin");
        group.MapPatch("/{id:guid}/status", ChangeStatusAsync).RequireAuthorization("EditorOrAdmin");
        group.MapPatch("/{id:guid}/schedule", ScheduleArticleAsync).RequireAuthorization("EditorOrAdmin");
        group.MapGet("/{id:guid}/review-notes", GetReviewNotesAsync).RequireAuthorization("ReviewerOrBetter");
        group.MapPost("/{id:guid}/review-notes", AddReviewNoteAsync).RequireAuthorization("ReviewerOrBetter");

        return app;
    }

    private static async Task<IResult> GetArticlesAsync(
        string? query,
        Guid? categoryId,
        Chronicle.Domain.Enums.ArticleStatus? status,
        Guid? authorId,
        bool? featured,
        string? sort,
        int page,
        int pageSize,
        IArticleService articleService,
        CancellationToken ct)
    {
        var result = await articleService.GetArticlesAsync(new ArticleListFilter
        {
            Query = query,
            CategoryId = categoryId,
            Status = status,
            AuthorId = authorId,
            Featured = featured,
            Sort = sort,
            Page = page <= 0 ? 1 : page,
            PageSize = pageSize <= 0 ? 20 : pageSize,
        }, ct);

        if (result.IsSuccess)
        {
            var data = result.Value!;
            return Results.Ok(new PagedResponse<ArticleListItemResponse>
            {
                Data = data.Items,
                Meta = new { data.Page, data.PageSize, data.Total },
            });
        }

        return ToErrorResult(result);
    }

    private static async Task<IResult> GetArticleBySlugAsync(string slug, IArticleService articleService, CancellationToken ct)
        => ToHttpResult(await articleService.GetBySlugAsync(slug, ct));

    private static async Task<IResult> CreateArticleAsync(CreateArticleRequest request, IArticleService articleService, CancellationToken ct)
        => ToHttpResult(await articleService.CreateAsync(request, ct), isCreated: true);

    private static async Task<IResult> UpdateArticleAsync(Guid id, UpdateArticleRequest request, IArticleService articleService, CancellationToken ct)
        => ToHttpResult(await articleService.UpdateAsync(id, request, ct));

    private static async Task<IResult> DeleteArticleAsync(Guid id, IArticleService articleService, CancellationToken ct)
        => ToHttpResult(await articleService.DeleteAsync(id, ct));

    private static async Task<IResult> ChangeStatusAsync(Guid id, ChangeArticleStatusRequest request, IArticleService articleService, CancellationToken ct)
        => ToHttpResult(await articleService.ChangeStatusAsync(id, request, ct));

    private static async Task<IResult> ScheduleArticleAsync(Guid id, ScheduleArticleRequest request, IArticleService articleService, CancellationToken ct)
        => ToHttpResult(await articleService.ScheduleAsync(id, request, ct));

    private static async Task<IResult> GetReviewQueueAsync(IArticleService articleService, CancellationToken ct)
        => ToHttpResult(await articleService.GetReviewQueueAsync(ct));

    private static async Task<IResult> GetReviewNotesAsync(Guid id, IArticleService articleService, CancellationToken ct)
        => ToHttpResult(await articleService.GetReviewNotesAsync(id, ct));

    private static async Task<IResult> AddReviewNoteAsync(Guid id, AddReviewNoteRequest request, IArticleService articleService, CancellationToken ct)
        => ToHttpResult(await articleService.AddReviewNoteAsync(id, request, ct), isCreated: true);

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
            "category_not_found" => Results.BadRequest(payload),
            "user_not_found" => Results.Json(payload, statusCode: StatusCodes.Status404NotFound),
            "forbidden" => Results.Json(payload, statusCode: StatusCodes.Status403Forbidden),
            "forbidden_status" => Results.Json(payload, statusCode: StatusCodes.Status403Forbidden),
            "unauthorized" => Results.Json(payload, statusCode: StatusCodes.Status401Unauthorized),
            "invalid_status_transition" => Results.Json(payload, statusCode: StatusCodes.Status409Conflict),
            _ => Results.BadRequest(payload),
        };
    }
}
