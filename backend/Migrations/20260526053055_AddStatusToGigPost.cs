using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SideKick.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusToGigPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "GigPosts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "GigPosts");
        }
    }
}
