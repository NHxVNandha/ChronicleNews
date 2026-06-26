using Chronicle.Domain.Enums;

namespace Chronicle.Application.Articles;

public static class ArticleWorkflowPolicy
{
    public static bool CanTransition(ArticleStatus current, ArticleStatus target, string? role)
    {
        if (!string.Equals(role, "Editor", StringComparison.OrdinalIgnoreCase)
            && !string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        return current switch
        {
            ArticleStatus.Draft => target is ArticleStatus.NeedsReview or ArticleStatus.Scheduled or ArticleStatus.Archived or ArticleStatus.Published,
            ArticleStatus.NeedsReview => target is ArticleStatus.Draft or ArticleStatus.Scheduled or ArticleStatus.Published or ArticleStatus.Archived,
            ArticleStatus.Scheduled => target is ArticleStatus.Draft or ArticleStatus.NeedsReview or ArticleStatus.Published or ArticleStatus.Archived,
            ArticleStatus.Published => target is ArticleStatus.Archived,
            ArticleStatus.Archived => target is ArticleStatus.Draft or ArticleStatus.Published,
            _ => false,
        };
    }
}
