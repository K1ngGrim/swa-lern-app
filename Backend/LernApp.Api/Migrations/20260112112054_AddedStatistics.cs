using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LernApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddedStatistics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "statistic",
                schema: "core",
                columns: table => new
                {
                    date = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    Data = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_statistic", x => new { x.user_id, x.date });
                    table.ForeignKey(
                        name: "FK_statistic_Users_user_id",
                        column: x => x.user_id,
                        principalSchema: "identity",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "statistic",
                schema: "core");
        }
    }
}
