using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LernApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddedProgressEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "progress",
                schema: "core",
                columns: table => new
                {
                    progress_id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CardId = table.Column<Guid>(type: "uuid", nullable: false),
                    Progression = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_progress", x => x.progress_id);
                    table.ForeignKey(
                        name: "FK_progress_card_CardId",
                        column: x => x.CardId,
                        principalSchema: "core",
                        principalTable: "card",
                        principalColumn: "card_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_progress_CardId",
                schema: "core",
                table: "progress",
                column: "CardId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "progress",
                schema: "core");
        }
    }
}
