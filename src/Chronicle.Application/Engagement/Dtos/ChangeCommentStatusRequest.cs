using Chronicle.Domain.Enums;

namespace Chronicle.Application.Engagement.Dtos;

public sealed class ChangeCommentStatusRequest
{
    public CommentStatus Status { get; init; }
}
