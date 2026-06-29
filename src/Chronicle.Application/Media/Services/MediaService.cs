using Chronicle.Application.Abstractions.Media;
using Chronicle.Application.Abstractions.Persistence;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Media.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Application.Media.Services;

public sealed class MediaService(IAppDbContext dbContext) : IMediaService
{
    public async Task<Result<IReadOnlyList<MediaAssetResponse>>> GetMediaAssetsAsync(CancellationToken ct)
    {
        var items = await dbContext.MediaAssets
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new MediaAssetResponse
            {
                Id = x.Id,
                Name = x.Name,
                Type = x.Type,
                Size = x.SizeLabel,
                Date = x.CreatedAt.ToString("MMM dd, yyyy"),
                Image = x.ImageUrl,
                UsageCount = x.UsageCount,
                AltStatus = x.HasAltText,
                Credit = x.Credit,
                License = x.License,
                Category = x.Category,
            })
            .ToListAsync(ct);

        return Result<IReadOnlyList<MediaAssetResponse>>.Success(items);
    }
}
