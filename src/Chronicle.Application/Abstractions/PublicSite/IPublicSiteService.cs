using Chronicle.Application.Common.Results;
using Chronicle.Application.PublicSite.Dtos;

namespace Chronicle.Application.Abstractions.PublicSite;

public interface IPublicSiteService
{
    Task<Result<PublicSiteSettingsResponse>> GetSettingsAsync(CancellationToken ct);
}
