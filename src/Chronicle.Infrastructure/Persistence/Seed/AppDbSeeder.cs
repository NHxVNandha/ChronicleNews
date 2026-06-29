using Chronicle.Domain.Entities;
using Chronicle.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Chronicle.Infrastructure.Persistence.Seed;

public static class AppDbSeeder
{
    public static async Task SeedAsync(AppDbContext context, CancellationToken cancellationToken = default)
    {
        var now = new DateTime(2026, 6, 25, 8, 0, 0, DateTimeKind.Utc);
        var passwordHasher = new PasswordHasher<object>();
        var passwordHash = passwordHasher.HashPassword(new object(), "Password123!");

        var roles = new[]
        {
            new Role { Id = SeedIds.Roles.Admin, Name = "Admin", Description = "Full system access, including users, roles, settings, and editorial control." },
            new Role { Id = SeedIds.Roles.Editor, Name = "Editor", Description = "Can manage editorial workflow, categories, scheduling, and publishing." },
            new Role { Id = SeedIds.Roles.Author, Name = "Author", Description = "Can create and edit own draft articles." },
            new Role { Id = SeedIds.Roles.Reviewer, Name = "Reviewer", Description = "Can review submitted articles and add review notes." },
        };

        var users = new[]
        {
            new User { Id = SeedIds.Users.Admin, FullName = "Julian Thorne", Email = "admin@chronicle.press", PasswordHash = passwordHash, RoleId = SeedIds.Roles.Admin, Status = UserStatus.Active, CreatedAt = now.AddDays(-10), UpdatedAt = now.AddDays(-1), LastLoginAt = now.AddHours(-2) },
            new User { Id = SeedIds.Users.Editor, FullName = "Eleanor Vance", Email = "editor@chronicle.press", PasswordHash = passwordHash, RoleId = SeedIds.Roles.Editor, Status = UserStatus.Active, CreatedAt = now.AddDays(-9), UpdatedAt = now.AddDays(-1), LastLoginAt = now.AddHours(-4) },
            new User { Id = SeedIds.Users.Author, FullName = "Marcus Chen", Email = "author@chronicle.press", PasswordHash = passwordHash, RoleId = SeedIds.Roles.Author, Status = UserStatus.Active, CreatedAt = now.AddDays(-8), UpdatedAt = now.AddDays(-1), LastLoginAt = now.AddHours(-6) },
            new User { Id = SeedIds.Users.Reviewer, FullName = "Sasha Grey", Email = "reviewer@chronicle.press", PasswordHash = passwordHash, RoleId = SeedIds.Roles.Reviewer, Status = UserStatus.Active, CreatedAt = now.AddDays(-7), UpdatedAt = now.AddDays(-1), LastLoginAt = now.AddHours(-8) },
        };

        var categories = new[]
        {
            new Category { Id = SeedIds.Categories.Technology, Name = "Technology", Slug = "technology", Description = "AI, platforms, gadgets, privacy, and infrastructure.", IsActive = true, CreatedAt = now.AddDays(-30), UpdatedAt = now.AddDays(-2) },
            new Category { Id = SeedIds.Categories.Education, Name = "Education", Slug = "education", Description = "Academic research, institutional policy, and lifelong learning.", IsActive = true, CreatedAt = now.AddDays(-30), UpdatedAt = now.AddDays(-2) },
            new Category { Id = SeedIds.Categories.Health, Name = "Health", Slug = "health", Description = "Medical research, public health, and scientific breakthroughs.", IsActive = true, CreatedAt = now.AddDays(-30), UpdatedAt = now.AddDays(-2) },
            new Category { Id = SeedIds.Categories.PoliticsAndPolicy, Name = "Politics & Policy", Slug = "politics-and-policy", Description = "Government, public policy, institutions, and civic affairs.", IsActive = true, CreatedAt = now.AddDays(-30), UpdatedAt = now.AddDays(-2) },
        };

        var articles = new[]
        {
            new Article { Id = SeedIds.Articles.ArchitectureOfTruth, Slug = "architecture-of-truth", Title = "The Architecture of Truth", Summary = "A new generation of newsrooms is rebuilding trust through transparent workflows and stronger editorial systems.", Body = "<p>A new generation of newsrooms is rebuilding trust through transparent workflows and stronger editorial systems.</p>", CategoryId = SeedIds.Categories.PoliticsAndPolicy, AuthorId = SeedIds.Users.Author, Status = ArticleStatus.Published, Featured = true, FeaturedImageUrl = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85", Views = 128000, SeoTitle = "The Architecture of Truth", SeoDescription = "A new generation of newsrooms is rebuilding trust through transparent workflows.", PublishedAt = now.AddDays(-2), CreatedAt = now.AddDays(-4), UpdatedAt = now.AddDays(-2) },
            new Article { Id = SeedIds.Articles.SovereignGrid, Slug = "sovereign-grid", Title = "The Sovereign Grid", Summary = "Decentralized information networks are reshaping how editorial systems distribute trust.", Body = "<p>Decentralized information networks are reshaping how editorial systems distribute trust.</p>", CategoryId = SeedIds.Categories.Technology, AuthorId = SeedIds.Users.Author, Status = ArticleStatus.Draft, Featured = false, FeaturedImageUrl = "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85", Views = 0, SeoTitle = "The Sovereign Grid", SeoDescription = "Decentralized information networks are reshaping editorial systems.", CreatedAt = now.AddDays(-3), UpdatedAt = now.AddDays(-1) },
            new Article { Id = SeedIds.Articles.CampusReimagined, Slug = "campus-reimagined", Title = "Campus Reimagined", Summary = "Universities are redesigning learning spaces as hybrid education becomes permanent.", Body = "<p>Universities are redesigning learning spaces as hybrid education becomes permanent.</p>", CategoryId = SeedIds.Categories.Education, AuthorId = SeedIds.Users.Author, Status = ArticleStatus.NeedsReview, Featured = false, FeaturedImageUrl = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85", Views = 0, SeoTitle = "Campus Reimagined", SeoDescription = "Universities are redesigning learning spaces for hybrid education.", CreatedAt = now.AddDays(-3), UpdatedAt = now.AddHours(-12) },
            new Article { Id = SeedIds.Articles.RedIndex, Slug = "red-index", Title = "The Red Index", Summary = "Global market realignment is forcing institutions to rethink economic dependency.", Body = "<p>Global market realignment is forcing institutions to rethink economic dependency.</p>", CategoryId = SeedIds.Categories.PoliticsAndPolicy, AuthorId = SeedIds.Users.Editor, Status = ArticleStatus.Published, Featured = false, FeaturedImageUrl = "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1200&q=85", Views = 94000, SeoTitle = "The Red Index", SeoDescription = "Global market realignment is forcing institutions to rethink economic dependency.", PublishedAt = now.AddDays(-5), CreatedAt = now.AddDays(-6), UpdatedAt = now.AddDays(-5) },
            new Article { Id = SeedIds.Articles.GeneticResilience, Slug = "genetic-resilience", Title = "Genetic Resilience", Summary = "Botanical breakthroughs are pushing crop science into the age of engineered drought survival.", Body = "<p>Botanical breakthroughs are pushing crop science into the age of engineered drought survival.</p>", CategoryId = SeedIds.Categories.Health, AuthorId = SeedIds.Users.Author, Status = ArticleStatus.Scheduled, Featured = false, FeaturedImageUrl = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=85", Views = 0, SeoTitle = "Genetic Resilience", SeoDescription = "Botanical breakthroughs are pushing crop science into drought survival.", ScheduledAt = now.AddDays(1), CreatedAt = now.AddDays(-2), UpdatedAt = now.AddHours(-10) },
            new Article { Id = SeedIds.Articles.TruthMachine, Slug = "truth-machine", Title = "The Truth Machine", Summary = "AI-assisted editorial systems still depend on human judgment to maintain public trust.", Body = "<p>AI-assisted editorial systems still depend on human judgment to maintain public trust.</p>", CategoryId = SeedIds.Categories.Technology, AuthorId = SeedIds.Users.Editor, Status = ArticleStatus.Archived, Featured = false, FeaturedImageUrl = "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85", Views = 57000, SeoTitle = "The Truth Machine", SeoDescription = "AI-assisted editorial systems still depend on human judgment.", PublishedAt = now.AddDays(-20), CreatedAt = now.AddDays(-21), UpdatedAt = now.AddDays(-7) },
        };

        var reviewNotes = new[]
        {
            new ReviewNote { Id = Guid.Parse("e1111111-1111-1111-1111-111111111111"), ArticleId = SeedIds.Articles.CampusReimagined, CreatedByUserId = SeedIds.Users.Reviewer, Note = "Tambahkan sumber resmi untuk klaim pada paragraf kedua.", CreatedAt = now.AddHours(-11) },
            new ReviewNote { Id = Guid.Parse("e2222222-2222-2222-2222-222222222222"), ArticleId = SeedIds.Articles.CampusReimagined, CreatedByUserId = SeedIds.Users.Editor, Note = "Perjelas konteks kebijakan universitas dan tambahkan kutipan narasumber.", CreatedAt = now.AddHours(-9) },
        };

        var mediaAssets = new[]
        {
            new MediaAsset { Id = SeedIds.MediaAssets.UrbanSkyline, Name = "urban-skyline-v1.jpg", Type = "Image", SizeLabel = "12.4 MB", ImageUrl = "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85", UsageCount = 12, HasAltText = true, Credit = "Chronicle Visual Desk", License = "Owned", Category = "Front Page", CreatedAt = now.AddDays(-2), UpdatedAt = now.AddDays(-2) },
            new MediaAsset { Id = SeedIds.MediaAssets.CeoPortrait, Name = "ceo-portrait-series.png", Type = "Image", SizeLabel = "8.1 MB", ImageUrl = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85", UsageCount = 4, HasAltText = false, Credit = "Studio Portrait Unit", License = "Licensed", Category = "Profiles", CreatedAt = now.AddDays(-4), UpdatedAt = now.AddDays(-4) },
            new MediaAsset { Id = SeedIds.MediaAssets.RainforestBroll, Name = "rainforest-broll-h264.mp4", Type = "Video", SizeLabel = "45.8 MB", ImageUrl = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85", UsageCount = 2, HasAltText = true, Credit = "Field Reporter Pool", License = "Owned", Category = "Environment", CreatedAt = now.AddDays(-5), UpdatedAt = now.AddDays(-5) },
            new MediaAsset { Id = SeedIds.MediaAssets.TechAbstract, Name = "tech-abstract-blue.jpg", Type = "Image", SizeLabel = "6.2 MB", ImageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85", UsageCount = 8, HasAltText = true, Credit = "Design Systems", License = "Owned", Category = "Technology", CreatedAt = now.AddDays(-6), UpdatedAt = now.AddDays(-6) },
            new MediaAsset { Id = SeedIds.MediaAssets.EditorialRoom, Name = "editorial-room.jpg", Type = "Image", SizeLabel = "9.5 MB", ImageUrl = "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85", UsageCount = 0, HasAltText = false, Credit = "Editorial Floor", License = "Pending", Category = "Newsroom", CreatedAt = now.AddDays(-7), UpdatedAt = now.AddDays(-7) },
        };

        var comments = new[]
        {
            new Comment { Id = SeedIds.Comments.Comment1, ArticleId = SeedIds.Articles.ArchitectureOfTruth, AuthorName = "Budi Santoso", Text = "Koreksi data pada paragraf kedua, angka inflasi seharusnya 5.2% bukan 4.8%.", Status = CommentStatus.Pending, CreatedAt = now.AddDays(-1).AddHours(1) },
            new Comment { Id = SeedIds.Comments.Comment2, ArticleId = SeedIds.Articles.SovereignGrid, AuthorName = "Sari Wulandari", Text = "Artikel ini perlu sumber tambahan untuk klaim tentang kebijakan fiskal.", Status = CommentStatus.Pending, CreatedAt = now.AddDays(-1).AddHours(2) },
            new Comment { Id = SeedIds.Comments.Comment3, ArticleId = SeedIds.Articles.CampusReimagined, AuthorName = "Ahmad Fauzi", Text = "Mohon periksa kembali data pada tabel bagian ketiga.", Status = CommentStatus.Pending, CreatedAt = now.AddDays(-1).AddHours(3) },
            new Comment { Id = SeedIds.Comments.Comment4, ArticleId = SeedIds.Articles.RedIndex, AuthorName = "Dewi Lestari", Text = "Foto yang digunakan tidak sesuai dengan konteks berita.", Status = CommentStatus.Flagged, CreatedAt = now.AddDays(-2) },
            new Comment { Id = SeedIds.Comments.Comment5, ArticleId = SeedIds.Articles.GeneticResilience, AuthorName = "Rudi Hartono", Text = "Konfirmasi jadwal wawancara sudah sesuai dengan narasumber.", Status = CommentStatus.Approved, CreatedAt = now.AddDays(-2).AddHours(-2) },
        };

        var commentReplies = new[]
        {
            new CommentReply { Id = Guid.Parse("c6111111-1111-1111-1111-111111111111"), CommentId = SeedIds.Comments.Comment4, AuthorName = "Editor", Text = "Sudah diganti dengan foto yang sesuai.", CreatedAt = now.AddDays(-2).AddHours(1) },
            new CommentReply { Id = Guid.Parse("c6222222-2222-2222-2222-222222222222"), CommentId = SeedIds.Comments.Comment5, AuthorName = "Editor", Text = "Sudah diperbaiki, terima kasih.", CreatedAt = now.AddDays(-2).AddHours(2) },
        };

        var campaigns = new[]
        {
            new Campaign { Id = SeedIds.Campaigns.Campaign1, Title = "Breaking News: Market Update", Type = CampaignType.Push, Audience = "All Subscribers", Status = CampaignStatus.Sent, OpenRate = "42%", SentAt = now.AddHours(-6), CreatedAt = now.AddDays(-1), UpdatedAt = now.AddHours(-6) },
            new Campaign { Id = SeedIds.Campaigns.Campaign2, Title = "Daily Newsletter - October 24", Type = CampaignType.Newsletter, Audience = "Email Subscribers", Status = CampaignStatus.Sent, OpenRate = "28%", SentAt = now.AddHours(-8), CreatedAt = now.AddDays(-1), UpdatedAt = now.AddHours(-8) },
            new Campaign { Id = SeedIds.Campaigns.Campaign3, Title = "Weekend Edition Preview", Type = CampaignType.Email, Audience = "Premium Readers", Status = CampaignStatus.Scheduled, CreatedAt = now.AddDays(-1), UpdatedAt = now.AddHours(-4), SentAt = now.AddDays(1) },
            new Campaign { Id = SeedIds.Campaigns.Campaign4, Title = "Election Coverage Alert", Type = CampaignType.Push, Audience = "All Subscribers", Status = CampaignStatus.Scheduled, CreatedAt = now.AddDays(-1), UpdatedAt = now.AddHours(-3), SentAt = now.AddHours(10) },
            new Campaign { Id = SeedIds.Campaigns.Campaign5, Title = "Special Report: Climate Summit", Type = CampaignType.Newsletter, Audience = "Climate Desk Followers", Status = CampaignStatus.Draft, CreatedAt = now.AddDays(-1), UpdatedAt = now.AddHours(-2) },
        };

        var seoSettings = new SeoSettings
        {
            Id = SeedIds.Optimization.SeoSettings,
            DefaultMetaTitle = "Chronicle News - Independent Journalism",
            MetaDescription = "Independent journalism for the informed reader. National news, in-depth analysis, and editorial integrity.",
            FocusKeyword = "digital transformation",
            RobotsTxt = "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://chronicle.news/sitemap.xml",
            EnableCrawling = true,
            IndexArticlePages = true,
            IndexCategoryPages = true,
            NoIndexAuthorPages = false,
            CreatedAt = now.AddDays(-30),
            UpdatedAt = now.AddDays(-1),
        };

        var aiSettings = new AiSettings
        {
            Id = SeedIds.Optimization.AiSettings,
            Provider = "OpenAI",
            ModelName = "gpt-4.1-mini",
            BaseUrl = "https://api.openai.com/v1",
            ApiKeyHint = "Stored securely on backend",
            Temperature = 0.2m,
            MaxTokens = 1200,
            SystemPrompt = "Anda adalah asisten editor berita berbahasa Indonesia. Koreksi ejaan sesuai KBBI, perbaiki tata bahasa, pertahankan gaya jurnalistik formal, netral, objektif, ringkas, dan jangan mengubah fakta tanpa catatan.",
            PrimaryLanguage = "Bahasa Indonesia",
            LanguageStandard = "KBBI",
            WritingStyle = "Jurnalistik formal",
            Tone = "Netral, objektif, ringkas",
            CreatedAt = now.AddDays(-30),
            UpdatedAt = now.AddDays(-1),
        };

        var activityLogs = new[]
        {
            new ActivityLog { Id = Guid.Parse("f1111111-1111-1111-1111-111111111111"), UserId = SeedIds.Users.Admin, Action = "login", EntityType = "Auth", Description = "User logged in.", CreatedAt = now.AddHours(-8) },
            new ActivityLog { Id = Guid.Parse("f2222222-2222-2222-2222-222222222222"), UserId = SeedIds.Users.Author, Action = "article_created", EntityType = "Article", EntityId = SeedIds.Articles.SovereignGrid.ToString(), Description = "Created article \"The Sovereign Grid\".", CreatedAt = now.AddHours(-7) },
            new ActivityLog { Id = Guid.Parse("f3333333-3333-3333-3333-333333333333"), UserId = SeedIds.Users.Editor, Action = "article_status_changed", EntityType = "Article", EntityId = SeedIds.Articles.CampusReimagined.ToString(), Description = "Changed article status to NeedsReview.", CreatedAt = now.AddHours(-6) },
            new ActivityLog { Id = Guid.Parse("f4444444-4444-4444-4444-444444444444"), UserId = SeedIds.Users.Reviewer, Action = "review_note_added", EntityType = "ReviewNote", EntityId = Guid.Parse("e1111111-1111-1111-1111-111111111111").ToString(), Description = "Added review note to article \"Campus Reimagined\".", CreatedAt = now.AddHours(-5) },
            new ActivityLog { Id = Guid.Parse("f5555555-5555-5555-5555-555555555555"), UserId = SeedIds.Users.Admin, Action = "article_published", EntityType = "Article", EntityId = SeedIds.Articles.ArchitectureOfTruth.ToString(), Description = "Published article \"The Architecture of Truth\".", CreatedAt = now.AddHours(-4) },
        };

        await AddMissingAsync(context.Roles, roles, cancellationToken);
        await AddMissingAsync(context.Users, users, cancellationToken);
        await AddMissingAsync(context.Categories, categories, cancellationToken);
        await AddMissingAsync(context.Articles, articles, cancellationToken);
        await AddMissingAsync(context.ReviewNotes, reviewNotes, cancellationToken);
        await AddMissingAsync(context.MediaAssets, mediaAssets, cancellationToken);
        await AddMissingAsync(context.Comments, comments, cancellationToken);
        await AddMissingAsync(context.CommentReplies, commentReplies, cancellationToken);
        await AddMissingAsync(context.Campaigns, campaigns, cancellationToken);
        await AddMissingAsync(context.ActivityLogs, activityLogs, cancellationToken);

        if (!await context.SeoSettings.AnyAsync(x => x.Id == seoSettings.Id, cancellationToken))
        {
            await context.SeoSettings.AddAsync(seoSettings, cancellationToken);
        }

        if (!await context.AiSettings.AnyAsync(x => x.Id == aiSettings.Id, cancellationToken))
        {
            await context.AiSettings.AddAsync(aiSettings, cancellationToken);
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    private static async Task AddMissingAsync<TEntity>(DbSet<TEntity> dbSet, IEnumerable<TEntity> items, CancellationToken cancellationToken)
        where TEntity : class
    {
        var trackedItems = items.ToList();
        var ids = trackedItems.Select(GetEntityId).ToList();
        var existingIds = await dbSet
            .Where(entity => ids.Contains(EF.Property<Guid>(entity, "Id")))
            .Select(entity => EF.Property<Guid>(entity, "Id"))
            .ToListAsync(cancellationToken);

        var missing = trackedItems.Where(entity => !existingIds.Contains(GetEntityId(entity))).ToList();
        if (missing.Count > 0)
        {
            await dbSet.AddRangeAsync(missing, cancellationToken);
        }
    }

    private static Guid GetEntityId<TEntity>(TEntity entity)
        where TEntity : class
        => (Guid)entity.GetType().GetProperty("Id")!.GetValue(entity)!;
}
