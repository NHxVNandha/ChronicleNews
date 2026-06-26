namespace Chronicle.Api.Contracts.Common;

public sealed class ApiResponse<T>
{
    public T Data { get; init; } = default!;
    public object? Meta { get; init; }
}
