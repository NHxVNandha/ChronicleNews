using Chronicle.Application.Abstractions.Auth;
using Chronicle.Application.Abstractions.Identity;
using Chronicle.Application.Abstractions.Persistence;
using Chronicle.Application.Abstractions.Users;
using Chronicle.Application.Common.Models;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Users.Dtos;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Application.Users.Services;

public sealed class UserService(
    IAppDbContext dbContext,
    IPasswordHasher passwordHasher,
    ICurrentUserService currentUserService,
    IValidator<CreateUserRequest> createValidator,
    IValidator<UpdateUserRequest> updateValidator,
    IValidator<ChangeUserStatusRequest> statusValidator) : IUserService
{
    public async Task<Result<PagedResult<UserListItemResponse>>> GetUsersAsync(int page, int pageSize, CancellationToken ct)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.Users
            .AsNoTracking()
            .Include(x => x.Role)
            .OrderByDescending(x => x.CreatedAt);

        var total = await query.CountAsync(ct);
        var users = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new UserListItemResponse
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.Email,
                Role = x.Role!.Name,
                Status = x.Status.ToString(),
                LastLoginAt = x.LastLoginAt,
                CreatedAt = x.CreatedAt,
            })
            .ToListAsync(ct);

        return Result<PagedResult<UserListItemResponse>>.Success(new PagedResult<UserListItemResponse>
        {
            Items = users,
            Page = page,
            PageSize = pageSize,
            Total = total,
        });
    }

    public async Task<Result<UserDetailResponse>> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var user = await dbContext.Users
            .AsNoTracking()
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (user is null || user.Role is null)
        {
            return Result<UserDetailResponse>.Failure("not_found", "User was not found.");
        }

        return Result<UserDetailResponse>.Success(MapDetail(user));
    }

    public async Task<Result<UserDetailResponse>> CreateAsync(CreateUserRequest request, CancellationToken ct)
    {
        var validation = await createValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<UserDetailResponse>.Failure("validation_error", "Create user request is invalid.", ToValidationErrors(validation));
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailExists = await dbContext.Users.AnyAsync(x => x.Email == normalizedEmail, ct);
        if (emailExists)
        {
            return Result<UserDetailResponse>.Failure("duplicate_email", "A user with the same email already exists.");
        }

        var role = await dbContext.Roles.FirstOrDefaultAsync(x => x.Id == request.RoleId, ct);
        if (role is null)
        {
            return Result<UserDetailResponse>.Failure("role_not_found", "Selected role was not found.");
        }

        var now = DateTime.UtcNow;
        var user = new Chronicle.Domain.Entities.User
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHasher.Hash(request.Password),
            RoleId = role.Id,
            Status = Chronicle.Domain.Enums.UserStatus.Active,
            CreatedAt = now,
            UpdatedAt = now,
        };

        await dbContext.Users.AddAsync(user, ct);
        await WriteActivityLogAsync("user_created", "User", user.Id.ToString(), $"Created user \"{user.FullName}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        user.Role = role;
        return Result<UserDetailResponse>.Success(MapDetail(user));
    }

    public async Task<Result<UserDetailResponse>> UpdateAsync(Guid id, UpdateUserRequest request, CancellationToken ct)
    {
        var validation = await updateValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<UserDetailResponse>.Failure("validation_error", "Update user request is invalid.", ToValidationErrors(validation));
        }

        var user = await dbContext.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (user is null)
        {
            return Result<UserDetailResponse>.Failure("not_found", "User was not found.");
        }

        var role = await dbContext.Roles.FirstOrDefaultAsync(x => x.Id == request.RoleId, ct);
        if (role is null)
        {
            return Result<UserDetailResponse>.Failure("role_not_found", "Selected role was not found.");
        }

        user.FullName = request.FullName.Trim();
        user.RoleId = role.Id;
        user.Role = role;
        user.UpdatedAt = DateTime.UtcNow;

        await WriteActivityLogAsync("user_updated", "User", user.Id.ToString(), $"Updated user \"{user.FullName}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result<UserDetailResponse>.Success(MapDetail(user));
    }

    public async Task<Result> ChangeStatusAsync(Guid id, ChangeUserStatusRequest request, CancellationToken ct)
    {
        var validation = await statusValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result.Failure("validation_error", "Change status request is invalid.", ToValidationErrors(validation));
        }

        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (user is null)
        {
            return Result.Failure("not_found", "User was not found.");
        }

        var currentUser = currentUserService.GetCurrentUser();
        if (currentUser.UserId == user.Id && request.Status == Chronicle.Domain.Enums.UserStatus.Disabled)
        {
            return Result.Failure("self_disable_forbidden", "You cannot disable your own account.");
        }

        user.Status = request.Status;
        user.UpdatedAt = DateTime.UtcNow;

        await WriteActivityLogAsync("user_status_changed", "User", user.Id.ToString(), $"Changed user \"{user.FullName}\" status to {user.Status}.", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result.Success();
    }

    private UserDetailResponse MapDetail(Chronicle.Domain.Entities.User user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        RoleId = user.RoleId,
        Role = user.Role?.Name ?? string.Empty,
        Status = user.Status.ToString(),
        LastLoginAt = user.LastLoginAt,
        CreatedAt = user.CreatedAt,
        UpdatedAt = user.UpdatedAt,
    };

    private async Task WriteActivityLogAsync(string action, string entityType, string? entityId, string description, CancellationToken ct)
    {
        var currentUser = currentUserService.GetCurrentUser();
        await dbContext.ActivityLogs.AddAsync(new Chronicle.Domain.Entities.ActivityLog
        {
            Id = Guid.NewGuid(),
            UserId = currentUser.UserId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Description = description,
            CreatedAt = DateTime.UtcNow,
        }, ct);
    }

    private static Dictionary<string, string[]> ToValidationErrors(FluentValidation.Results.ValidationResult validation)
        => validation.Errors.GroupBy(x => x.PropertyName).ToDictionary(x => x.Key, x => x.Select(v => v.ErrorMessage).ToArray());
}
