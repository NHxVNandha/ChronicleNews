using Chronicle.Domain.Common;

namespace Chronicle.Domain.Entities;

public sealed class AiSettings : AuditableEntity
{
    public string Provider { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public string ApiKeyHint { get; set; } = string.Empty;
    public decimal Temperature { get; set; }
    public int MaxTokens { get; set; }
    public string SystemPrompt { get; set; } = string.Empty;
    public string PrimaryLanguage { get; set; } = string.Empty;
    public string LanguageStandard { get; set; } = string.Empty;
    public string WritingStyle { get; set; } = string.Empty;
    public string Tone { get; set; } = string.Empty;
}
