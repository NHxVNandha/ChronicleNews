namespace Chronicle.Api.Contracts.Common;

public sealed class ApiErrorResponse
{
    public ApiError Error { get; init; } = default!;
}

public sealed class ApiError
{
    public string Code { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public Dictionary<string, string[]>? Details { get; init; }
}
