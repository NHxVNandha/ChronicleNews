using Chronicle.Application.Abstractions.Optimization;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Optimization.Dtos;
using Chronicle.Domain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Application.Optimization.Services;

public sealed class OptimizationService(
    Chronicle.Application.Abstractions.Persistence.IAppDbContext dbContext,
    IValidator<UpdateSeoSettingsRequest> seoValidator,
    IValidator<UpdateAiSettingsRequest> aiValidator) : IOptimizationService
{
    public async Task<Result<SeoSettingsResponse>> GetSeoSettingsAsync(CancellationToken ct)
    {
        var settings = await dbContext.SeoSettings.AsNoTracking().FirstAsync(ct);
        return Result<SeoSettingsResponse>.Success(MapSeo(settings));
    }

    public async Task<Result<SeoSettingsResponse>> UpdateSeoSettingsAsync(UpdateSeoSettingsRequest request, CancellationToken ct)
    {
        var validation = await seoValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<SeoSettingsResponse>.Failure("validation_error", "SEO settings request is invalid.", ToValidationErrors(validation));
        }

        var settings = await dbContext.SeoSettings.FirstAsync(ct);
        settings.DefaultMetaTitle = request.DefaultMetaTitle.Trim();
        settings.MetaDescription = request.MetaDescription.Trim();
        settings.FocusKeyword = request.FocusKeyword.Trim();
        settings.RobotsTxt = request.RobotsTxt;
        settings.EnableCrawling = request.EnableCrawling;
        settings.IndexArticlePages = request.IndexArticlePages;
        settings.IndexCategoryPages = request.IndexCategoryPages;
        settings.NoIndexAuthorPages = request.NoIndexAuthorPages;
        settings.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(ct);

        return Result<SeoSettingsResponse>.Success(MapSeo(settings));
    }

    public async Task<Result<AiSettingsResponse>> GetAiSettingsAsync(CancellationToken ct)
    {
        var settings = await dbContext.AiSettings.AsNoTracking().FirstAsync(ct);
        return Result<AiSettingsResponse>.Success(MapAi(settings));
    }

    public async Task<Result<AiSettingsResponse>> UpdateAiSettingsAsync(UpdateAiSettingsRequest request, CancellationToken ct)
    {
        var validation = await aiValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<AiSettingsResponse>.Failure("validation_error", "AI settings request is invalid.", ToValidationErrors(validation));
        }

        var settings = await dbContext.AiSettings.FirstAsync(ct);
        settings.Provider = request.Provider.Trim();
        settings.ModelName = request.ModelName.Trim();
        settings.BaseUrl = request.BaseUrl.Trim();
        settings.ApiKeyHint = request.ApiKeyHint.Trim();
        settings.Temperature = request.Temperature;
        settings.MaxTokens = request.MaxTokens;
        settings.SystemPrompt = request.SystemPrompt;
        settings.PrimaryLanguage = request.PrimaryLanguage.Trim();
        settings.LanguageStandard = request.LanguageStandard.Trim();
        settings.WritingStyle = request.WritingStyle.Trim();
        settings.Tone = request.Tone.Trim();
        settings.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(ct);

        return Result<AiSettingsResponse>.Success(MapAi(settings));
    }

    private static SeoSettingsResponse MapSeo(SeoSettings settings) => new()
    {
        DefaultMetaTitle = settings.DefaultMetaTitle,
        MetaDescription = settings.MetaDescription,
        FocusKeyword = settings.FocusKeyword,
        RobotsTxt = settings.RobotsTxt,
        EnableCrawling = settings.EnableCrawling,
        IndexArticlePages = settings.IndexArticlePages,
        IndexCategoryPages = settings.IndexCategoryPages,
        NoIndexAuthorPages = settings.NoIndexAuthorPages,
    };

    private static AiSettingsResponse MapAi(AiSettings settings) => new()
    {
        Provider = settings.Provider,
        ModelName = settings.ModelName,
        BaseUrl = settings.BaseUrl,
        ApiKeyHint = settings.ApiKeyHint,
        Temperature = settings.Temperature,
        MaxTokens = settings.MaxTokens,
        SystemPrompt = settings.SystemPrompt,
        PrimaryLanguage = settings.PrimaryLanguage,
        LanguageStandard = settings.LanguageStandard,
        WritingStyle = settings.WritingStyle,
        Tone = settings.Tone,
    };

    private static Dictionary<string, string[]> ToValidationErrors(FluentValidation.Results.ValidationResult validation)
        => validation.Errors.GroupBy(x => x.PropertyName).ToDictionary(x => x.Key, x => x.Select(v => v.ErrorMessage).ToArray());
}
