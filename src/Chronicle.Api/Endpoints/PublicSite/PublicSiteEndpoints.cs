using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.PublicSite;
using Chronicle.Application.PublicSite.Dtos;

namespace Chronicle.Api.Endpoints.PublicSite;

public static class PublicSiteEndpoints
{
    public static IEndpointRouteBuilder MapPublicSiteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/public-site").WithTags("Public Site");
        group.MapGet("/settings", GetSettingsAsync).AllowAnonymous();
        return app;
    }

    private static async Task<IResult> GetSettingsAsync(IPublicSiteService service, CancellationToken ct)
    {
        var result = await service.GetSettingsAsync(ct);
        return Results.Ok(new ApiResponse<PublicSiteSettingsResponse> { Data = result.Value! });
    }
}
