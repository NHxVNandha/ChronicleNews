using Chronicle.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chronicle.Infrastructure.Persistence.Configurations;

public sealed class SeoSettingsConfiguration : IEntityTypeConfiguration<SeoSettings>
{
    public void Configure(EntityTypeBuilder<SeoSettings> builder)
    {
        builder.ToTable("SeoSettings");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.DefaultMetaTitle).HasMaxLength(250).IsRequired();
        builder.Property(x => x.MetaDescription).HasMaxLength(300).IsRequired();
        builder.Property(x => x.FocusKeyword).HasMaxLength(120).IsRequired();
        builder.Property(x => x.RobotsTxt).HasColumnType("nvarchar(max)").IsRequired();
        builder.Property(x => x.CreatedAt).HasColumnType("datetime2").IsRequired();
        builder.Property(x => x.UpdatedAt).HasColumnType("datetime2").IsRequired();
    }
}
