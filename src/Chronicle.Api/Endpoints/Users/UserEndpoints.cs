using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.Users;
using Chronicle.Application.Common.Models;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Users.Dtos;

namespace Chronicle.Api.Endpoints.Users;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users")
            .WithTags("Users")
            .RequireAuthorization("AdminOnly");

        group.MapGet("/", GetUsersAsync);
        group.MapGet("/{id:guid}", GetUserByIdAsync);
        group.MapPost("/", CreateUserAsync);
        group.MapPut("/{id:guid}", UpdateUserAsync);
        group.MapPatch("/{id:guid}/status", ChangeStatusAsync);

        return app;
    }

    private static async Task<IResult> GetUsersAsync(int page, int pageSize, IUserService userService, CancellationToken ct)
    {
        var result = await userService.GetUsersAsync(page <= 0 ? 1 : page, pageSize <= 0 ? 20 : pageSize, ct);
        if (result.IsSuccess)
        {
            var data = result.Value!;
            return Results.Ok(new PagedResponse<UserListItemResponse>
            {
                Data = data.Items,
                Meta = new { data.Page, data.PageSize, data.Total },
            });
        }

        return ToErrorResult(result);
    }

    private static async Task<IResult> GetUserByIdAsync(Guid id, IUserService userService, CancellationToken ct)
        => ToHttpResult(await userService.GetByIdAsync(id, ct));

    private static async Task<IResult> CreateUserAsync(CreateUserRequest request, IUserService userService, CancellationToken ct)
        => ToHttpResult(await userService.CreateAsync(request, ct), isCreated: true);

    private static async Task<IResult> UpdateUserAsync(Guid id, UpdateUserRequest request, IUserService userService, CancellationToken ct)
        => ToHttpResult(await userService.UpdateAsync(id, request, ct));

    private static async Task<IResult> ChangeStatusAsync(Guid id, ChangeUserStatusRequest request, IUserService userService, CancellationToken ct)
        => ToHttpResult(await userService.ChangeStatusAsync(id, request, ct));

    private static IResult ToHttpResult(Result result)
        => result.IsSuccess
            ? Results.Ok(new ApiResponse<string> { Data = "ok" })
            : ToErrorResult(result);

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
            "duplicate_email" => Results.Json(payload, statusCode: StatusCodes.Status409Conflict),
            "role_not_found" => Results.BadRequest(payload),
            "self_disable_forbidden" => Results.Json(payload, statusCode: StatusCodes.Status409Conflict),
            _ => Results.BadRequest(payload),
        };
    }
}
