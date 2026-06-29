namespace Chronicle.Application.Optimization.Dtos;

public sealed class SeoSettingsResponse
{
    public string DefaultMetaTitle { get; init; } = string.Empty;
    public string MetaDescription { get; init; } = string.Empty;
    public string FocusKeyword { get; init; } = string.Empty;
    public string RobotsTxt { get; init; } = string.Empty;
    public bool EnableCrawling { get; init; }
    public bool IndexArticlePages { get; init; }
    public bool IndexCategoryPages { get; init; }
    public bool NoIndexAuthorPages { get; init; }
}
