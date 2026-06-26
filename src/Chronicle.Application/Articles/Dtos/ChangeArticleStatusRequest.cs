using Chronicle.Domain.Enums;

namespace Chronicle.Application.Articles.Dtos;

public sealed class ChangeArticleStatusRequest
{
    public ArticleStatus Status { get; init; }
}
