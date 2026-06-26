namespace Chronicle.Application.Common.Results;

public class Result<T> : Result
{
    public T? Value { get; private init; }

    public static Result<T> Success(T value) => new()
    {
        IsSuccess = true,
        Value = value,
    };

    public static new Result<T> Failure(string errorCode, string errorMessage, Dictionary<string, string[]>? validationErrors = null) => new()
    {
        IsSuccess = false,
        ErrorCode = errorCode,
        ErrorMessage = errorMessage,
        ValidationErrors = validationErrors,
    };
}
