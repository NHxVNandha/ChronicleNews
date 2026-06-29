using Chronicle.Application.Abstractions.Engagement;
using Chronicle.Application.Abstractions.Identity;
using Chronicle.Application.Abstractions.Persistence;
using Chronicle.Application.Common.Results;
using Chronicle.Application.Engagement.Dtos;
using Chronicle.Domain.Entities;
using Chronicle.Domain.Enums;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Application.Engagement.Services;

public sealed class EngagementService(
    IAppDbContext dbContext,
    ICurrentUserService currentUserService,
    IValidator<ChangeCommentStatusRequest> statusValidator,
    IValidator<AddCommentReplyRequest> replyValidator,
    IValidator<CreateCampaignRequest> campaignValidator) : IEngagementService
{
    public async Task<Result<IReadOnlyList<CommentResponse>>> GetCommentsAsync(CommentStatus? status, CancellationToken ct)
    {
        var query = dbContext.Comments
            .AsNoTracking()
            .Include(x => x.Article)
            .Include(x => x.Replies)
            .OrderByDescending(x => x.CreatedAt)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        var comments = await query
            .Select(x => new CommentResponse
            {
                Id = x.Id,
                Text = x.Text,
                ArticleTitle = x.Article!.Title,
                Author = x.AuthorName,
                Date = x.CreatedAt.ToString("yyyy-MM-dd HH:mm"),
                Status = x.Status.ToString(),
                Replies = x.Replies.OrderBy(y => y.CreatedAt).Select(y => new CommentReplyResponse
                {
                    Id = y.Id,
                    Author = y.AuthorName,
                    Text = y.Text,
                    Date = y.CreatedAt.ToString("yyyy-MM-dd HH:mm"),
                }).ToList(),
            })
            .ToListAsync(ct);

        return Result<IReadOnlyList<CommentResponse>>.Success(comments);
    }

    public async Task<Result<CommentResponse>> ChangeCommentStatusAsync(Guid id, ChangeCommentStatusRequest request, CancellationToken ct)
    {
        var validation = await statusValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<CommentResponse>.Failure("validation_error", "Comment status request is invalid.", ToValidationErrors(validation));
        }

        var comment = await dbContext.Comments.Include(x => x.Article).Include(x => x.Replies).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (comment is null || comment.Article is null)
        {
            return Result<CommentResponse>.Failure("not_found", "Comment was not found.");
        }

        comment.Status = request.Status;
        await WriteActivityLogAsync("comment_status_changed", "Comment", comment.Id.ToString(), $"Changed comment status to {comment.Status}.", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result<CommentResponse>.Success(MapComment(comment));
    }

    public async Task<Result<CommentReplyResponse>> AddReplyAsync(Guid id, AddCommentReplyRequest request, CancellationToken ct)
    {
        var validation = await replyValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<CommentReplyResponse>.Failure("validation_error", "Reply request is invalid.", ToValidationErrors(validation));
        }

        var comment = await dbContext.Comments.Include(x => x.Article).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (comment is null || comment.Article is null)
        {
            return Result<CommentReplyResponse>.Failure("not_found", "Comment was not found.");
        }

        var currentUser = currentUserService.GetCurrentUser();
        var authorName = currentUser.Email is null ? "Editor" : "Editor";

        var reply = new CommentReply
        {
            Id = Guid.NewGuid(),
            CommentId = comment.Id,
            AuthorName = authorName,
            Text = request.Text.Trim(),
            CreatedAt = DateTime.UtcNow,
        };

        await dbContext.CommentReplies.AddAsync(reply, ct);
        await WriteActivityLogAsync("comment_reply_added", "CommentReply", reply.Id.ToString(), $"Added reply to comment for article \"{comment.Article.Title}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result<CommentReplyResponse>.Success(new CommentReplyResponse
        {
            Id = reply.Id,
            Author = reply.AuthorName,
            Text = reply.Text,
            Date = reply.CreatedAt.ToString("yyyy-MM-dd HH:mm"),
        });
    }

    public async Task<Result<IReadOnlyList<CampaignResponse>>> GetCampaignsAsync(CancellationToken ct)
    {
        var items = await dbContext.Campaigns
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new CampaignResponse
            {
                Id = x.Id,
                Title = x.Title,
                Type = x.Type.ToString(),
                Audience = x.Audience,
                Sent = x.SentAt.HasValue ? x.SentAt.Value.ToString("yyyy-MM-dd HH:mm") : string.Empty,
                Status = x.Status.ToString(),
                OpenRate = x.OpenRate,
            })
            .ToListAsync(ct);

        return Result<IReadOnlyList<CampaignResponse>>.Success(items);
    }

    public async Task<Result<CampaignResponse>> CreateCampaignAsync(CreateCampaignRequest request, CancellationToken ct)
    {
        var validation = await campaignValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
        {
            return Result<CampaignResponse>.Failure("validation_error", "Campaign request is invalid.", ToValidationErrors(validation));
        }

        var campaign = new Campaign
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Type = request.Type,
            Audience = request.Audience.Trim(),
            Status = CampaignStatus.Draft,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await dbContext.Campaigns.AddAsync(campaign, ct);
        await WriteActivityLogAsync("campaign_created", "Campaign", campaign.Id.ToString(), $"Created campaign \"{campaign.Title}\".", ct);
        await dbContext.SaveChangesAsync(ct);

        return Result<CampaignResponse>.Success(new CampaignResponse
        {
            Id = campaign.Id,
            Title = campaign.Title,
            Type = campaign.Type.ToString(),
            Audience = campaign.Audience,
            Sent = string.Empty,
            Status = campaign.Status.ToString(),
        });
    }

    public Task<Result<IReadOnlyList<SubscriberSummaryResponse>>> GetSubscriberSummaryAsync(CancellationToken ct)
    {
        IReadOnlyList<SubscriberSummaryResponse> items = [
            new SubscriberSummaryResponse { Tier = "Free", Count = "18,420", Delta = "+342" },
            new SubscriberSummaryResponse { Tier = "Premium", Count = "4,286", Delta = "+87" },
            new SubscriberSummaryResponse { Tier = "Newsletter Only", Count = "12,150", Delta = "+210" },
            new SubscriberSummaryResponse { Tier = "Push Subscribers", Count = "8,740", Delta = "+156" },
        ];

        return Task.FromResult(Result<IReadOnlyList<SubscriberSummaryResponse>>.Success(items));
    }

    private CommentResponse MapComment(Comment comment) => new()
    {
        Id = comment.Id,
        Text = comment.Text,
        ArticleTitle = comment.Article?.Title ?? string.Empty,
        Author = comment.AuthorName,
        Date = comment.CreatedAt.ToString("yyyy-MM-dd HH:mm"),
        Status = comment.Status.ToString(),
        Replies = comment.Replies.OrderBy(x => x.CreatedAt).Select(x => new CommentReplyResponse
        {
            Id = x.Id,
            Author = x.AuthorName,
            Text = x.Text,
            Date = x.CreatedAt.ToString("yyyy-MM-dd HH:mm"),
        }).ToList(),
    };

    private async Task WriteActivityLogAsync(string action, string entityType, string? entityId, string description, CancellationToken ct)
    {
        var currentUser = currentUserService.GetCurrentUser();
        await dbContext.ActivityLogs.AddAsync(new ActivityLog
        {
            Id = Guid.NewGuid(),
            UserId = currentUser.UserId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Description = description,
            CreatedAt = DateTime.UtcNow,
        }, ct);
    }

    private static Dictionary<string, string[]> ToValidationErrors(FluentValidation.Results.ValidationResult validation)
        => validation.Errors.GroupBy(x => x.PropertyName).ToDictionary(x => x.Key, x => x.Select(v => v.ErrorMessage).ToArray());
}
