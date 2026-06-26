using Chronicle.Application.ActivityLogs.Dtos;
using Chronicle.Application.Common.Filters;
using Chronicle.Application.Common.Models;
using Chronicle.Application.Common.Results;

namespace Chronicle.Application.Abstractions.ActivityLogs;

public interface IActivityLogService
{
    Task<Result<PagedResult<ActivityLogResponse>>> GetLogsAsync(ActivityLogFilter filter, CancellationToken ct);
}
