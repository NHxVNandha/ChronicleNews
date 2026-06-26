using Chronicle.Application.Auth.Dtos;
using Chronicle.Application.Common.Results;

namespace Chronicle.Application.Abstractions.Auth;

public interface IAuthService
{
    Task<Result<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken ct);
    Task<Result<LoginResponse>> RefreshAsync(RefreshTokenRequest request, CancellationToken ct);
    Task<Result> LogoutAsync(string refreshToken, CancellationToken ct);
    Task<Result<CurrentUserResponse>> GetCurrentUserAsync(CancellationToken ct);
}
