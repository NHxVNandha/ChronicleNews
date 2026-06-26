namespace Chronicle.Application.Users.Dtos;

public sealed class CreateUserRequest
{
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public Guid RoleId { get; init; }
}
