using Chronicle.Application.Common.Results;
using Chronicle.Application.Optimization.Dtos;

namespace Chronicle.Application.Abstractions.Optimization;

public interface IOptimizationService
{
    Task<Result<SeoSettingsResponse>> GetSeoSettingsAsync(CancellationToken ct);
    Task<Result<SeoSettingsResponse>> UpdateSeoSettingsAsync(UpdateSeoSettingsRequest request, CancellationToken ct);
    Task<Result<AiSettingsResponse>> GetAiSettingsAsync(CancellationToken ct);
    Task<Result<AiSettingsResponse>> UpdateAiSettingsAsync(UpdateAiSettingsRequest request, CancellationToken ct);
}
