using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LernApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class CardLearningState : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "progress",
                schema: "core");

            migrationBuilder.AddColumn<double>(
                name: "Interval",
                schema: "core",
                table: "card",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "Repetitions",
                schema: "core",
                table: "card",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "State",
                schema: "core",
                table: "card",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "due_date",
                schema: "core",
                table: "card",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Interval",
                schema: "core",
                table: "card");

            migrationBuilder.DropColumn(
                name: "Repetitions",
                schema: "core",
                table: "card");

            migrationBuilder.DropColumn(
                name: "State",
                schema: "core",
                table: "card");

            migrationBuilder.DropColumn(
                name: "due_date",
                schema: "core",
                table: "card");

            migrationBuilder.CreateTable(
                name: "progress",
                schema: "core",
                columns: table => new
                {
                    progress_id = table.Column<Guid>(type: "uuid", nullable: false),
                    CardId = table.Column<Guid>(type: "uuid", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: false),
                    Modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    ModifierId = table.Column<Guid>(type: "uuid", nullable: true),
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
    }
}
