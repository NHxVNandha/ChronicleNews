using Chronicle.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chronicle.Infrastructure.Persistence.Configurations;

public sealed class AiSettingsConfiguration : IEntityTypeConfiguration<AiSettings>
{
    public void Configure(EntityTypeBuilder<AiSettings> builder)
    {
        builder.ToTable("AiSettings");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Provider).HasMaxLength(100).IsRequired();
        builder.Property(x => x.ModelName).HasMaxLength(100).IsRequired();
        builder.Property(x => x.BaseUrl).HasMaxLength(255).IsRequired();
        builder.Property(x => x.ApiKeyHint).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Temperature).HasPrecision(4, 2).IsRequired();
        builder.Property(x => x.SystemPrompt).HasColumnType("nvarchar(max)").IsRequired();
        builder.Property(x => x.PrimaryLanguage).HasMaxLength(100).IsRequired();
        builder.Property(x => x.LanguageStandard).HasMaxLength(100).IsRequired();
        builder.Property(x => x.WritingStyle).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Tone).HasMaxLength(100).IsRequired();
        builder.Property(x => x.CreatedAt).HasColumnType("datetime2").IsRequired();
        builder.Property(x => x.UpdatedAt).HasColumnType("datetime2").IsRequired();
    }
}
