using Chronicle.Domain.Common;

namespace Chronicle.Domain.Entities;

public sealed class SeoSettings : AuditableEntity
{
    public string DefaultMetaTitle { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public string FocusKeyword { get; set; } = string.Empty;
    public string RobotsTxt { get; set; } = string.Empty;
    public bool EnableCrawling { get; set; }
    public bool IndexArticlePages { get; set; }
    public bool IndexCategoryPages { get; set; }
    public bool NoIndexAuthorPages { get; set; }
}
