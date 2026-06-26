using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.Roles;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Roles.Dtos;

namespace Chronicle.Api.Endpoints.Roles;

public static class RoleEndpoints
{
    public static IEndpointRouteBuilder MapRoleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/roles")
            .WithTags("Roles")
            .RequireAuthorization("EditorialAccess");

        group.MapGet("/", GetRolesAsync);

        return app;
    }

    private static async Task<IResult> GetRolesAsync(IRoleService roleService, CancellationToken ct)
    {
        var result = await roleService.GetRolesAsync(ct);
        return result.IsSuccess
            ? Results.Ok(new ApiResponse<IReadOnlyList<RoleResponse>> { Data = result.Value! })
            : Results.BadRequest(new ApiErrorResponse { Error = new ApiError { Code = result.ErrorCode ?? "request_failed", Message = result.ErrorMessage ?? "Request failed." } });
    }
}
