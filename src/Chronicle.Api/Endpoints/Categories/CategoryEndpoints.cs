using Chronicle.Api.Contracts.Common;
using Chronicle.Application.Abstractions.Categories;
using Chronicle.Application.Categories.Dtos;
using Chronicle.Application.Common.Results;

namespace Chronicle.Api.Endpoints.Categories;

public static class CategoryEndpoints
{
    public static IEndpointRouteBuilder MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/categories").WithTags("Categories");

        group.MapGet("/", GetCategoriesAsync).AllowAnonymous();
        group.MapGet("/{id:guid}", GetCategoryByIdAsync).AllowAnonymous();
        group.MapPost("/", CreateCategoryAsync).RequireAuthorization("EditorOrAdmin");
        group.MapPut("/{id:guid}", UpdateCategoryAsync).RequireAuthorization("EditorOrAdmin");
        group.MapDelete("/{id:guid}", DeleteCategoryAsync).RequireAuthorization("EditorOrAdmin");

        return app;
    }

    private static async Task<IResult> GetCategoriesAsync(ICategoryService categoryService, CancellationToken ct)
        => ToHttpResult(await categoryService.GetCategoriesAsync(ct));

    private static async Task<IResult> GetCategoryByIdAsync(Guid id, ICategoryService categoryService, CancellationToken ct)
        => ToHttpResult(await categoryService.GetByIdAsync(id, ct));

    private static async Task<IResult> CreateCategoryAsync(CreateCategoryRequest request, ICategoryService categoryService, CancellationToken ct)
        => ToHttpResult(await categoryService.CreateAsync(request, ct), isCreated: true);

    private static async Task<IResult> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request, ICategoryService categoryService, CancellationToken ct)
        => ToHttpResult(await categoryService.UpdateAsync(id, request, ct));

    private static async Task<IResult> DeleteCategoryAsync(Guid id, ICategoryService categoryService, CancellationToken ct)
        => ToHttpResult(await categoryService.DeleteAsync(id, ct));

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
            "category_in_use" => Results.Json(payload, statusCode: StatusCodes.Status409Conflict),
            _ => Results.BadRequest(payload),
        };
    }
}
