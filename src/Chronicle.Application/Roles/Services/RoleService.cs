using Chronicle.Application.Abstractions.Persistence;
using Chronicle.Application.Abstractions.Roles;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Roles.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Application.Roles.Services;

public sealed class RoleService(IAppDbContext dbContext) : IRoleService
{
    public async Task<Result<IReadOnlyList<RoleResponse>>> GetRolesAsync(CancellationToken ct)
    {
        var roles = await dbContext.Roles
            .AsNoTracking()
            .ToListAsync(ct);

        var order = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
        {
            ["Admin"] = 1,
            ["Editor"] = 2,
            ["Author"] = 3,
            ["Reviewer"] = 4,
        };

        var result = roles
            .OrderBy(x => order.TryGetValue(x.Name, out var value) ? value : int.MaxValue)
            .ThenBy(x => x.Name)
            .Select(x => new RoleResponse
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
            })
            .ToList();

        return Result<IReadOnlyList<RoleResponse>>.Success(result);
    }
}
