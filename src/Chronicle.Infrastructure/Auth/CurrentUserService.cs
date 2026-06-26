using Chronicle.Application.Abstractions.Identity;
using Chronicle.Application.Common.Models;
using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Chronicle.Infrastructure.Auth;

public sealed class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public CurrentUserInfo GetCurrentUser()
    {
        var principal = httpContextAccessor.HttpContext?.User;
        if (principal?.Identity?.IsAuthenticated != true)
        {
            return new CurrentUserInfo { IsAuthenticated = false };
        }

        var idClaim = principal.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = Guid.TryParse(idClaim, out var parsedId) ? parsedId : null;

        return new CurrentUserInfo
        {
            UserId = userId,
            Email = principal.FindFirstValue(JwtRegisteredClaimNames.Email),
            Role = principal.FindFirstValue(ClaimTypes.Role),
            IsAuthenticated = true,
        };
    }
}
