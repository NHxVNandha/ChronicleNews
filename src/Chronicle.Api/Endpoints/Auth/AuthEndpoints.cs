using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.Auth;
using Chronicle.Application.Auth.Dtos;
using Chronicle.Application.Common.Results;

namespace Chronicle.Api.Endpoints.Auth;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/login", LoginAsync).AllowAnonymous();
        group.MapPost("/refresh", RefreshAsync).AllowAnonymous();
        group.MapPost("/logout", LogoutAsync).RequireAuthorization();
        group.MapGet("/me", MeAsync).RequireAuthorization();

        return app;
    }

    private static async Task<IResult> LoginAsync(LoginRequest request, IAuthService authService, CancellationToken ct)
        => ToHttpResult(await authService.LoginAsync(request, ct), isCreated: false);

    private static async Task<IResult> RefreshAsync(RefreshTokenRequest request, IAuthService authService, CancellationToken ct)
        => ToHttpResult(await authService.RefreshAsync(request, ct), isCreated: false);

    private static async Task<IResult> LogoutAsync(RefreshTokenRequest request, IAuthService authService, CancellationToken ct)
        => ToHttpResult(await authService.LogoutAsync(request.RefreshToken, ct));

    private static async Task<IResult> MeAsync(IAuthService authService, CancellationToken ct)
        => ToHttpResult(await authService.GetCurrentUserAsync(ct), isCreated: false);

    private static IResult ToHttpResult(Result result)
    {
        if (result.IsSuccess)
        {
            return Results.Ok(new ApiResponse<string> { Data = "ok" });
        }

        return ToErrorResult(result.ErrorCode, result.ErrorMessage, result.ValidationErrors);
    }

    private static IResult ToHttpResult<T>(Result<T> result, bool isCreated)
    {
        if (result.IsSuccess)
        {
            return isCreated
                ? Results.Created(string.Empty, new ApiResponse<T> { Data = result.Value! })
                : Results.Ok(new ApiResponse<T> { Data = result.Value! });
        }

        return ToErrorResult(result.ErrorCode, result.ErrorMessage, result.ValidationErrors);
    }

    private static IResult ToErrorResult(string? errorCode, string? errorMessage, Dictionary<string, string[]>? validationErrors)
    {
        var payload = new ApiErrorResponse
        {
            Error = new ApiError
            {
                Code = errorCode ?? "unknown_error",
                Message = errorMessage ?? "Request failed.",
                Details = validationErrors,
            },
        };

        return errorCode switch
        {
            "validation_error" => Results.BadRequest(payload),
            "invalid_credentials" => Results.Json(payload, statusCode: StatusCodes.Status401Unauthorized),
            "invalid_refresh_token" => Results.Json(payload, statusCode: StatusCodes.Status401Unauthorized),
            "expired_refresh_token" => Results.Json(payload, statusCode: StatusCodes.Status401Unauthorized),
            "revoked_refresh_token" => Results.Json(payload, statusCode: StatusCodes.Status401Unauthorized),
            "unauthorized" => Results.Json(payload, statusCode: StatusCodes.Status401Unauthorized),
            "user_disabled" => Results.Json(payload, statusCode: StatusCodes.Status403Forbidden),
            "user_not_active" => Results.Json(payload, statusCode: StatusCodes.Status403Forbidden),
            "user_not_found" => Results.Json(payload, statusCode: StatusCodes.Status404NotFound),
            _ => Results.Json(payload, statusCode: StatusCodes.Status400BadRequest),
        };
    }
}
