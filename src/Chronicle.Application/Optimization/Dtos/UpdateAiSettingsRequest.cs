namespace Chronicle.Application.Optimization.Dtos;

public sealed class UpdateAiSettingsRequest
{
    public string Provider { get; init; } = string.Empty;
    public string ModelName { get; init; } = string.Empty;
    public string BaseUrl { get; init; } = string.Empty;
    public string ApiKeyHint { get; init; } = string.Empty;
    public decimal Temperature { get; init; }
    public int MaxTokens { get; init; }
    public string SystemPrompt { get; init; } = string.Empty;
    public string PrimaryLanguage { get; init; } = string.Empty;
    public string LanguageStandard { get; init; } = string.Empty;
    public string WritingStyle { get; init; } = string.Empty;
    public string Tone { get; init; } = string.Empty;
}
