using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chronicle.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddOptimizationSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AiSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Provider = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ModelName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BaseUrl = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ApiKeyHint = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Temperature = table.Column<decimal>(type: "decimal(4,2)", precision: 4, scale: 2, nullable: false),
                    MaxTokens = table.Column<int>(type: "int", nullable: false),
                    SystemPrompt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryLanguage = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LanguageStandard = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    WritingStyle = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Tone = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AiSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SeoSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DefaultMetaTitle = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    MetaDescription = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    FocusKeyword = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    RobotsTxt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EnableCrawling = table.Column<bool>(type: "bit", nullable: false),
                    IndexArticlePages = table.Column<bool>(type: "bit", nullable: false),
                    IndexCategoryPages = table.Column<bool>(type: "bit", nullable: false),
                    NoIndexAuthorPages = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeoSettings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AiSettings");

            migrationBuilder.DropTable(
                name: "SeoSettings");
        }
    }
}
