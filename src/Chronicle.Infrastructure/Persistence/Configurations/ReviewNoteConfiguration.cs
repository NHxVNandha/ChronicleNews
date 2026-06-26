using Chronicle.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chronicle.Infrastructure.Persistence.Configurations;

public sealed class ReviewNoteConfiguration : IEntityTypeConfiguration<ReviewNote>
{
    public void Configure(EntityTypeBuilder<ReviewNote> builder)
    {
        builder.ToTable("ReviewNotes");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Note).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.CreatedAt).HasColumnType("datetime2").IsRequired();

        builder.HasIndex(x => x.ArticleId);
        builder.HasIndex(x => new { x.ArticleId, x.CreatedAt });

        builder.HasOne(x => x.Article)
            .WithMany(x => x.ReviewNotes)
            .HasForeignKey(x => x.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.CreatedByUser)
            .WithMany(x => x.ReviewNotes)
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
