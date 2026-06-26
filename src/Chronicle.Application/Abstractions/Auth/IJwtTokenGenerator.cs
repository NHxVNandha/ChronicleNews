using Chronicle.Domain.Entities;

namespace Chronicle.Application.Abstractions.Auth;

public interface IJwtTokenGenerator
{
    string GenerateAccessToken(User user, string roleName);
    string GenerateRefreshToken();
    DateTime GetRefreshTokenExpiryUtc();
}
