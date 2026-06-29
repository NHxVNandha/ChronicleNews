using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.Media;
using Chronicle.Application.Media.Dtos;

namespace Chronicle.Api.Endpoints.Media;

public static class MediaEndpoints
{
    public static IEndpointRouteBuilder MapMediaEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/media")
            .WithTags("Media")
            .RequireAuthorization("EditorialAccess");

        group.MapGet("/", GetMediaAssetsAsync);

        return app;
    }

    private static async Task<IResult> GetMediaAssetsAsync(IMediaService mediaService, CancellationToken ct)
    {
        var result = await mediaService.GetMediaAssetsAsync(ct);
        return Results.Ok(new ApiResponse<IReadOnlyList<MediaAssetResponse>> { Data = result.Value! });
    }
}
