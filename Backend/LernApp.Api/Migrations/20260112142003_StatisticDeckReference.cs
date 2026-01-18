using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LernApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class StatisticDeckReference : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DeckId",
                schema: "core",
                table: "statistic",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_statistic_DeckId",
                schema: "core",
                table: "statistic",
                column: "DeckId");

            migrationBuilder.AddForeignKey(
                name: "FK_statistic_deck_DeckId",
                schema: "core",
                table: "statistic",
                column: "DeckId",
                principalSchema: "core",
                principalTable: "deck",
                principalColumn: "deck_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_statistic_deck_DeckId",
                schema: "core",
                table: "statistic");

            migrationBuilder.DropIndex(
                name: "IX_statistic_DeckId",
                schema: "core",
                table: "statistic");

            migrationBuilder.DropColumn(
                name: "DeckId",
                schema: "core",
                table: "statistic");
        }
    }
}
