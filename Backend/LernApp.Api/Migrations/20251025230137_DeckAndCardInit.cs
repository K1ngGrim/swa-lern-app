using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LernApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class DeckAndCardInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "deck_id",
                schema: "core",
                table: "card",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "deck",
                schema: "core",
                columns: table => new
                {
                    deck_id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_deck", x => x.deck_id);
                    table.ForeignKey(
                        name: "FK_deck_Users_user_id",
                        column: x => x.user_id,
                        principalSchema: "identity",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_card_deck_id",
                schema: "core",
                table: "card",
                column: "deck_id");

            migrationBuilder.CreateIndex(
                name: "IX_deck_user_id",
                schema: "core",
                table: "deck",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_card_deck_deck_id",
                schema: "core",
                table: "card",
                column: "deck_id",
                principalSchema: "core",
                principalTable: "deck",
                principalColumn: "deck_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_card_deck_deck_id",
                schema: "core",
                table: "card");

            migrationBuilder.DropTable(
                name: "deck",
                schema: "core");

            migrationBuilder.DropIndex(
                name: "IX_card_deck_id",
                schema: "core",
                table: "card");

            migrationBuilder.DropColumn(
                name: "deck_id",
                schema: "core",
                table: "card");
        }
    }
}
