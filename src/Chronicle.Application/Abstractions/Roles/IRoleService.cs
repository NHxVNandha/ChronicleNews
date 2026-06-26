using Chronicle.Application.Common.Results;
using Chronicle.Application.Roles.Dtos;

namespace Chronicle.Application.Abstractions.Roles;

public interface IRoleService
{
    Task<Result<IReadOnlyList<RoleResponse>>> GetRolesAsync(CancellationToken ct);
}
