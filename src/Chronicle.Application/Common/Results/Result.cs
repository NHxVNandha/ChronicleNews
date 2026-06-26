namespace Chronicle.Application.Common.Results;

public class Result
{
    public bool IsSuccess { get; protected init; }
    public string? ErrorCode { get; protected init; }
    public string? ErrorMessage { get; protected init; }
    public Dictionary<string, string[]>? ValidationErrors { get; protected init; }

    public static Result Success() => new() { IsSuccess = true };

    public static Result Failure(string errorCode, string errorMessage, Dictionary<string, string[]>? validationErrors = null) => new()
    {
        IsSuccess = false,
        ErrorCode = errorCode,
        ErrorMessage = errorMessage,
        ValidationErrors = validationErrors,
    };
}
