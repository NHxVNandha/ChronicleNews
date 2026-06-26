using Chronicle.Api.Contracts.Common;

namespace Chronicle.Api.Middleware;

public sealed class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Unhandled exception while processing request {Path}", context.Request.Path);

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new ApiErrorResponse
            {
                Error = new ApiError
                {
                    Code = "server_error",
                    Message = "An unexpected error occurred.",
                },
            });
        }
    }
}
