using Chronicle.Application.Abstractions.PublicSite;
using Chronicle.Application.Common.Results;
using Chronicle.Application.PublicSite.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Application.PublicSite.Services;

public sealed class PublicSiteService(Chronicle.Application.Abstractions.Persistence.IAppDbContext dbContext) : IPublicSiteService
{
    public async Task<Result<PublicSiteSettingsResponse>> GetSettingsAsync(CancellationToken ct)
    {
        var settings = await dbContext.PublicSiteSettings.AsNoTracking().FirstAsync(ct);
        return Result<PublicSiteSettingsResponse>.Success(new PublicSiteSettingsResponse
        {
            BrandName = settings.BrandName,
            AboutHeadline = settings.AboutHeadline,
            AboutSummary = settings.AboutSummary,
            MissionTitle = settings.MissionTitle,
            MissionBody = settings.MissionBody,
            MissionBodySecondary = settings.MissionBodySecondary,
            EditorialDeskSummary = settings.EditorialDeskSummary,
            ContactHeading = settings.ContactHeading,
            ContactSummary = settings.ContactSummary,
            EditorialEmail = settings.EditorialEmail,
            SecureTipLine = settings.SecureTipLine,
            HeadquartersAddress = settings.HeadquartersAddress,
        });
    }
}
