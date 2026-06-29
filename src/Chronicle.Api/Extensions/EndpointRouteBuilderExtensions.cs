using Chronicle.Api.Contracts.Common;
using Chronicle.Api.Endpoints.Auth;
using Chronicle.Api.Endpoints.Articles;
using Chronicle.Api.Endpoints.ActivityLogs;
using Chronicle.Api.Endpoints.Categories;
using Chronicle.Api.Endpoints.Dashboard;
using Chronicle.Api.Endpoints.Engagement;
using Chronicle.Api.Endpoints.Media;
using Chronicle.Api.Endpoints.Optimization;
using Chronicle.Api.Endpoints.Roles;
using Chronicle.Api.Endpoints.Users;

namespace Chronicle.Api.Extensions;

public static class EndpointRouteBuilderExtensions
{
    public static IEndpointRouteBuilder MapApiEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapAuthEndpoints();
        app.MapRoleEndpoints();
        app.MapUserEndpoints();
        app.MapCategoryEndpoints();
        app.MapArticleEndpoints();
        app.MapActivityLogEndpoints();
        app.MapDashboardEndpoints();
        app.MapMediaEndpoints();
        app.MapEngagementEndpoints();
        app.MapOptimizationEndpoints();

        var api = app.MapGroup("/api");

        api.MapGet("/health", () => Results.Ok(new ApiResponse<object>
        {
            Data = new { status = "ok" },
        }))
        .WithName("GetHealth")
        .WithTags("System");

        return app;
    }
}
