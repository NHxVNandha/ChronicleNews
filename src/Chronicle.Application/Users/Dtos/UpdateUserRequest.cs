namespace Chronicle.Application.Users.Dtos;

public sealed class UpdateUserRequest
{
    public string FullName { get; init; } = string.Empty;
    public Guid RoleId { get; init; }
}
