using Chronicle.Application.Abstractions.Persistence;
using Chronicle.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Infrastructure.Persistence;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<ReviewNote> ReviewNotes => Set<ReviewNote>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<CommentReply> CommentReplies => Set<CommentReply>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<SeoSettings> SeoSettings => Set<SeoSettings>();
    public DbSet<AiSettings> AiSettings => Set<AiSettings>();
    public DbSet<PublicSiteSettings> PublicSiteSettings => Set<PublicSiteSettings>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
