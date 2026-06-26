namespace Chronicle.Application.Auth.Dtos;

public sealed class LoginResponse
{
    public string AccessToken { get; init; } = string.Empty;
    public string RefreshToken { get; init; } = string.Empty;
    public int ExpiresInSeconds { get; init; }
    public CurrentUserResponse User { get; init; } = default!;
}
