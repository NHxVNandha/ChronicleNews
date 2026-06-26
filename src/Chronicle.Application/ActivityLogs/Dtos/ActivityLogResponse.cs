namespace Chronicle.Application.ActivityLogs.Dtos;

public sealed class ActivityLogResponse
{
    public Guid Id { get; init; }
    public Guid? UserId { get; init; }
    public string? UserName { get; init; }
    public string Action { get; init; } = string.Empty;
    public string EntityType { get; init; } = string.Empty;
    public string? EntityId { get; init; }
    public string Description { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}
