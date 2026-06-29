using Chronicle.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Application.Abstractions.Persistence;

public interface IAppDbContext
{
    DbSet<Role> Roles { get; }
    DbSet<User> Users { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<Category> Categories { get; }
    DbSet<Article> Articles { get; }
    DbSet<ReviewNote> ReviewNotes { get; }
    DbSet<ActivityLog> ActivityLogs { get; }
    DbSet<MediaAsset> MediaAssets { get; }
    DbSet<Comment> Comments { get; }
    DbSet<CommentReply> CommentReplies { get; }
    DbSet<Campaign> Campaigns { get; }
    DbSet<SeoSettings> SeoSettings { get; }
    DbSet<AiSettings> AiSettings { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
