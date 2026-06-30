using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chronicle.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicSiteSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PublicSiteSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BrandName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    AboutHeadline = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AboutSummary = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MissionTitle = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    MissionBody = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MissionBodySecondary = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EditorialDeskSummary = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactHeading = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ContactSummary = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EditorialEmail = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    SecureTipLine = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    HeadquartersAddress = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PublicSiteSettings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PublicSiteSettings");
        }
    }
}
