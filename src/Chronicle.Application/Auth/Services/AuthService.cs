using Chronicle.Application.Abstractions.Auth;
using Chronicle.Application.Abstractions.Identity;
using Chronicle.Application.Abstractions.Persistence;
using Chronicle.Application.Auth.Dtos;
using Chronicle.Application.Common.Results;
using Chronicle.Domain.Entities;
using Chronicle.Domain.Enums;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Application.Auth.Services;

public sealed class AuthService(
    IAppDbContext dbContext,
    IJwtTokenGenerator jwtTokenGenerator,
    IPasswordHasher passwordHasher,
    ICurrentUserService currentUserService,
    IValidator<LoginRequest> loginValidator,
    IValidator<RefreshTokenRequest> refreshTokenValidator) : IAuthService
{
    public async Task<Result<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        var validation = await loginValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<LoginResponse>.Failure("validation_error", "Login request is invalid.", ToValidationErrors(validation));
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await dbContext.Users
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Email == normalizedEmail, ct);

        if (user is null || user.Role is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return Result<LoginResponse>.Failure("invalid_credentials", "Email or password is incorrect.");
        }

        if (user.Status == UserStatus.Disabled)
        {
            return Result<LoginResponse>.Failure("user_disabled", "User account is disabled.");
        }

        if (user.Status != UserStatus.Active)
        {
            return Result<LoginResponse>.Failure("user_not_active", "User account is not active.");
        }

        var accessToken = jwtTokenGenerator.GenerateAccessToken(user, user.Role.Name);
        var refreshTokenValue = jwtTokenGenerator.GenerateRefreshToken();

        user.LastLoginAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;

        await dbContext.RefreshTokens.AddAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshTokenValue,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = jwtTokenGenerator.GetRefreshTokenExpiryUtc(),
        }, ct);

        await dbContext.ActivityLogs.AddAsync(new ActivityLog
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Action = "login",
            EntityType = "Auth",
            Description = "User logged in.",
            CreatedAt = DateTime.UtcNow,
        }, ct);

        await dbContext.SaveChangesAsync(ct);

        return Result<LoginResponse>.Success(new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            ExpiresInSeconds = 15 * 60,
            User = MapCurrentUser(user),
        });
    }

    public async Task<Result<LoginResponse>> RefreshAsync(RefreshTokenRequest request, CancellationToken ct)
    {
        var validation = await refreshTokenValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<LoginResponse>.Failure("validation_error", "Refresh token request is invalid.", ToValidationErrors(validation));
        }

        var existingToken = await dbContext.RefreshTokens
            .Include(x => x.User)
            .ThenInclude(x => x!.Role)
            .FirstOrDefaultAsync(x => x.Token == request.RefreshToken, ct);

        if (existingToken is null || existingToken.User is null || existingToken.User.Role is null)
        {
            return Result<LoginResponse>.Failure("invalid_refresh_token", "Refresh token is invalid.");
        }

        if (existingToken.RevokedAt is not null)
        {
            return Result<LoginResponse>.Failure("revoked_refresh_token", "Refresh token has been revoked.");
        }

        if (existingToken.ExpiresAt <= DateTime.UtcNow)
        {
            return Result<LoginResponse>.Failure("expired_refresh_token", "Refresh token has expired.");
        }

        existingToken.RevokedAt = DateTime.UtcNow;
        var replacementToken = jwtTokenGenerator.GenerateRefreshToken();
        existingToken.ReplacedByToken = replacementToken;

        await dbContext.RefreshTokens.AddAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = existingToken.UserId,
            Token = replacementToken,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = jwtTokenGenerator.GetRefreshTokenExpiryUtc(),
        }, ct);

        await dbContext.SaveChangesAsync(ct);

        return Result<LoginResponse>.Success(new LoginResponse
        {
            AccessToken = jwtTokenGenerator.GenerateAccessToken(existingToken.User, existingToken.User.Role.Name),
            RefreshToken = replacementToken,
            ExpiresInSeconds = 15 * 60,
            User = MapCurrentUser(existingToken.User),
        });
    }

    public async Task<Result> LogoutAsync(string refreshToken, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return Result.Failure("validation_error", "Refresh token is required.");
        }

        var existingToken = await dbContext.RefreshTokens
            .FirstOrDefaultAsync(x => x.Token == refreshToken, ct);

        if (existingToken is not null && existingToken.RevokedAt is null)
        {
            existingToken.RevokedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync(ct);
        }

        return Result.Success();
    }

    public async Task<Result<CurrentUserResponse>> GetCurrentUserAsync(CancellationToken ct)
    {
        var currentUser = currentUserService.GetCurrentUser();
        if (!currentUser.IsAuthenticated || currentUser.UserId is null)
        {
            return Result<CurrentUserResponse>.Failure("unauthorized", "Authentication is required.");
        }

        var user = await dbContext.Users
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == currentUser.UserId.Value, ct);

        if (user is null || user.Role is null)
        {
            return Result<CurrentUserResponse>.Failure("user_not_found", "Current user was not found.");
        }

        return Result<CurrentUserResponse>.Success(MapCurrentUser(user));
    }

    private static CurrentUserResponse MapCurrentUser(User user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Role = user.Role?.Name ?? string.Empty,
        Status = user.Status.ToString(),
    };

    private static Dictionary<string, string[]> ToValidationErrors(FluentValidation.Results.ValidationResult validation)
        => validation.Errors
            .GroupBy(x => x.PropertyName)
            .ToDictionary(x => x.Key, x => x.Select(v => v.ErrorMessage).ToArray());
}
