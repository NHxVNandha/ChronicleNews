namespace Chronicle.Application.Common.Models;

public sealed class CurrentUserInfo
{
    public Guid? UserId { get; init; }
    public string? Email { get; init; }
    public string? Role { get; init; }
    public bool IsAuthenticated { get; init; }
}
