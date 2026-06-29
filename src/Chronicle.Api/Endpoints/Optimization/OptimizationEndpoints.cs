using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.Optimization;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Optimization.Dtos;

namespace Chronicle.Api.Endpoints.Optimization;

public static class OptimizationEndpoints
{
    public static IEndpointRouteBuilder MapOptimizationEndpoints(this IEndpointRouteBuilder app)
    {
        var seo = app.MapGroup("/api/seo").WithTags("SEO").RequireAuthorization("EditorOrAdmin");
        seo.MapGet("/settings", GetSeoSettingsAsync);
        seo.MapPut("/settings", UpdateSeoSettingsAsync);

        var ai = app.MapGroup("/api/ai-settings").WithTags("AI Settings").RequireAuthorization("EditorOrAdmin");
        ai.MapGet("/", GetAiSettingsAsync);
        ai.MapPut("/", UpdateAiSettingsAsync);

        return app;
    }

    private static async Task<IResult> GetSeoSettingsAsync(IOptimizationService service, CancellationToken ct)
        => Results.Ok(new ApiResponse<SeoSettingsResponse> { Data = (await service.GetSeoSettingsAsync(ct)).Value! });

    private static async Task<IResult> UpdateSeoSettingsAsync(UpdateSeoSettingsRequest request, IOptimizationService service, CancellationToken ct)
        => ToHttpResult(await service.UpdateSeoSettingsAsync(request, ct));

    private static async Task<IResult> GetAiSettingsAsync(IOptimizationService service, CancellationToken ct)
        => Results.Ok(new ApiResponse<AiSettingsResponse> { Data = (await service.GetAiSettingsAsync(ct)).Value! });

    private static async Task<IResult> UpdateAiSettingsAsync(UpdateAiSettingsRequest request, IOptimizationService service, CancellationToken ct)
        => ToHttpResult(await service.UpdateAiSettingsAsync(request, ct));

    private static IResult ToHttpResult<T>(Result<T> result)
        => result.IsSuccess
            ? Results.Ok(new ApiResponse<T> { Data = result.Value! })
            : Results.BadRequest(new ApiErrorResponse { Error = new ApiError { Code = result.ErrorCode ?? "request_failed", Message = result.ErrorMessage ?? "Request failed.", Details = result.ValidationErrors } });
}
