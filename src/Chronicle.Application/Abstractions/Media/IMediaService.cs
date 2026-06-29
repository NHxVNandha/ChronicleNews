using Chronicle.Application.Common.Results;
using Chronicle.Application.Media.Dtos;

namespace Chronicle.Application.Abstractions.Media;

public interface IMediaService
{
    Task<Result<IReadOnlyList<MediaAssetResponse>>> GetMediaAssetsAsync(CancellationToken ct);
}
