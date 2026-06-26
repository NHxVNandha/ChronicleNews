namespace Chronicle.Application.Roles.Dtos;

public sealed class RoleResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
}
