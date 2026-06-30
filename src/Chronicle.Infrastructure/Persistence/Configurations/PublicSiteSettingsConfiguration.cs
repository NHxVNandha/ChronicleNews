using Chronicle.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chronicle.Infrastructure.Persistence.Configurations;

public sealed class PublicSiteSettingsConfiguration : IEntityTypeConfiguration<PublicSiteSettings>
{
    public void Configure(EntityTypeBuilder<PublicSiteSettings> builder)
    {
        builder.ToTable("PublicSiteSettings");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.BrandName).HasMaxLength(100).IsRequired();
        builder.Property(x => x.AboutHeadline).HasMaxLength(255).IsRequired();
        builder.Property(x => x.AboutSummary).HasColumnType("nvarchar(max)").IsRequired();
        builder.Property(x => x.MissionTitle).HasMaxLength(150).IsRequired();
        builder.Property(x => x.MissionBody).HasColumnType("nvarchar(max)").IsRequired();
        builder.Property(x => x.MissionBodySecondary).HasColumnType("nvarchar(max)").IsRequired();
        builder.Property(x => x.EditorialDeskSummary).HasColumnType("nvarchar(max)").IsRequired();
        builder.Property(x => x.ContactHeading).HasMaxLength(255).IsRequired();
        builder.Property(x => x.ContactSummary).HasColumnType("nvarchar(max)").IsRequired();
        builder.Property(x => x.EditorialEmail).HasMaxLength(150).IsRequired();
        builder.Property(x => x.SecureTipLine).HasMaxLength(150).IsRequired();
        builder.Property(x => x.HeadquartersAddress).HasMaxLength(255).IsRequired();
        builder.Property(x => x.CreatedAt).HasColumnType("datetime2").IsRequired();
        builder.Property(x => x.UpdatedAt).HasColumnType("datetime2").IsRequired();
    }
}
