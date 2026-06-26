namespace Chronicle.Application.Common.Filters;

public sealed class ActivityLogFilter
{
    public Guid? UserId { get; init; }
    public string? Action { get; init; }
    public string? EntityType { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
