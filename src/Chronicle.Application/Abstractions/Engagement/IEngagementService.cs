using Chronicle.Application.Common.Results;
using Chronicle.Application.Engagement.Dtos;
using Chronicle.Domain.Enums;

namespace Chronicle.Application.Abstractions.Engagement;

public interface IEngagementService
{
    Task<Result<IReadOnlyList<CommentResponse>>> GetCommentsAsync(CommentStatus? status, CancellationToken ct);
    Task<Result<CommentResponse>> ChangeCommentStatusAsync(Guid id, ChangeCommentStatusRequest request, CancellationToken ct);
    Task<Result<CommentReplyResponse>> AddReplyAsync(Guid id, AddCommentReplyRequest request, CancellationToken ct);
    Task<Result<IReadOnlyList<CampaignResponse>>> GetCampaignsAsync(CancellationToken ct);
    Task<Result<CampaignResponse>> CreateCampaignAsync(CreateCampaignRequest request, CancellationToken ct);
    Task<Result<IReadOnlyList<SubscriberSummaryResponse>>> GetSubscriberSummaryAsync(CancellationToken ct);
}
