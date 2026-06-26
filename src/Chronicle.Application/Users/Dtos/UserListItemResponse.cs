namespace Chronicle.Application.Users.Dtos;

public sealed class UserListItemResponse
{
    public Guid Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime? LastLoginAt { get; init; }
    public DateTime CreatedAt { get; init; }
}
