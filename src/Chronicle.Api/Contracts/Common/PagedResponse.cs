namespace Chronicle.Api.Contracts.Common;

public sealed class PagedResponse<T>
{
    public IReadOnlyList<T> Data { get; init; } = [];
    public object? Meta { get; init; }
}
