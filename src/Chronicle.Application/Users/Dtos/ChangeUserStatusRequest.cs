using Chronicle.Domain.Enums;

namespace Chronicle.Application.Users.Dtos;

public sealed class ChangeUserStatusRequest
{
    public UserStatus Status { get; init; }
}
