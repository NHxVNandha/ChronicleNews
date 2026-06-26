using Chronicle.Application.Abstractions.ActivityLogs;
using Chronicle.Application.Abstractions.Persistence;
using Chronicle.Application.ActivityLogs.Dtos;
using Chronicle.Application.Common.Filters;
using Chronicle.Application.Common.Models;
using Chronicle.Application.Common.Results;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Application.ActivityLogs.Services;

public sealed class ActivityLogService(IAppDbContext dbContext) : IActivityLogService
{
    public async Task<Result<PagedResult<ActivityLogResponse>>> GetLogsAsync(ActivityLogFilter filter, CancellationToken ct)
    {
        var page = Math.Max(filter.Page, 1);
        var pageSize = Math.Clamp(filter.PageSize, 1, 100);

        var query = dbContext.ActivityLogs
            .AsNoTracking()
            .Include(x => x.User)
            .AsQueryable();

        if (filter.UserId.HasValue)
        {
            query = query.Where(x => x.UserId == filter.UserId.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Action))
        {
            query = query.Where(x => x.Action == filter.Action);
        }

        if (!string.IsNullOrWhiteSpace(filter.EntityType))
        {
            query = query.Where(x => x.EntityType == filter.EntityType);
        }

        query = query.OrderByDescending(x => x.CreatedAt);

        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new ActivityLogResponse
            {
                Id = x.Id,
                UserId = x.UserId,
                UserName = x.User != null ? x.User.FullName : null,
                Action = x.Action,
                EntityType = x.EntityType,
                EntityId = x.EntityId,
                Description = x.Description,
                CreatedAt = x.CreatedAt,
            })
            .ToListAsync(ct);

        return Result<PagedResult<ActivityLogResponse>>.Success(new PagedResult<ActivityLogResponse>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            Total = total,
        });
    }
}
