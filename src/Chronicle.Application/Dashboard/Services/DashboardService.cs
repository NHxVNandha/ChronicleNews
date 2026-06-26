using Chronicle.Application.Abstractions.Dashboard;
using Chronicle.Application.Abstractions.Persistence;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Dashboard.Dtos;
using Chronicle.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Application.Dashboard.Services;

public sealed class DashboardService(IAppDbContext dbContext) : IDashboardService
{
    public async Task<Result<DashboardSummaryResponse>> GetSummaryAsync(CancellationToken ct)
    {
        var publishedArticles = await dbContext.Articles.CountAsync(x => x.Status == ArticleStatus.Published, ct);
        var draftQueue = await dbContext.Articles.CountAsync(x => x.Status == ArticleStatus.Draft, ct);

        return Result<DashboardSummaryResponse>.Success(new DashboardSummaryResponse
        {
            PublishedArticles = publishedArticles,
            DraftQueue = draftQueue,
            MediaAssets = 8904,
            MonthlyReaders = 2400000,
        });
    }

    public async Task<Result<DashboardPipelineResponse>> GetPipelineAsync(CancellationToken ct)
    {
        var counts = await dbContext.Articles
            .AsNoTracking()
            .GroupBy(x => x.Status)
            .Select(x => new { Status = x.Key, Count = x.Count() })
            .ToListAsync(ct);

        return Result<DashboardPipelineResponse>.Success(new DashboardPipelineResponse
        {
            Draft = counts.FirstOrDefault(x => x.Status == ArticleStatus.Draft)?.Count ?? 0,
            NeedsReview = counts.FirstOrDefault(x => x.Status == ArticleStatus.NeedsReview)?.Count ?? 0,
            Scheduled = counts.FirstOrDefault(x => x.Status == ArticleStatus.Scheduled)?.Count ?? 0,
            Published = counts.FirstOrDefault(x => x.Status == ArticleStatus.Published)?.Count ?? 0,
        });
    }

    public async Task<Result<IReadOnlyList<DashboardRecentActivityResponse>>> GetRecentActivityAsync(CancellationToken ct)
    {
        var items = await dbContext.ActivityLogs
            .AsNoTracking()
            .Include(x => x.User)
            .OrderByDescending(x => x.CreatedAt)
            .Take(10)
            .Select(x => new DashboardRecentActivityResponse
            {
                Action = x.Action,
                Title = x.Description,
                User = x.User != null ? x.User.FullName : "System",
                Time = x.CreatedAt,
            })
            .ToListAsync(ct);

        return Result<IReadOnlyList<DashboardRecentActivityResponse>>.Success(items);
    }
}
