using Chronicle.Application.Common.Models;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Users.Dtos;

namespace Chronicle.Application.Abstractions.Users;

public interface IUserService
{
    Task<Result<PagedResult<UserListItemResponse>>> GetUsersAsync(int page, int pageSize, CancellationToken ct);
    Task<Result<UserDetailResponse>> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Result<UserDetailResponse>> CreateAsync(CreateUserRequest request, CancellationToken ct);
    Task<Result<UserDetailResponse>> UpdateAsync(Guid id, UpdateUserRequest request, CancellationToken ct);
    Task<Result> ChangeStatusAsync(Guid id, ChangeUserStatusRequest request, CancellationToken ct);
}
