using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LernApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class StatisticsDateChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_statistic",
                schema: "core",
                table: "statistic");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "date",
                schema: "core",
                table: "statistic",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTimeOffset),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<Guid>(
                name: "StatisticId",
                schema: "core",
                table: "statistic",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_statistic",
                schema: "core",
                table: "statistic",
                column: "StatisticId");

            migrationBuilder.CreateIndex(
                name: "IX_statistic_user_id",
                schema: "core",
                table: "statistic",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_statistic",
                schema: "core",
                table: "statistic");

            migrationBuilder.DropIndex(
                name: "IX_statistic_user_id",
                schema: "core",
                table: "statistic");

            migrationBuilder.DropColumn(
                name: "StatisticId",
                schema: "core",
                table: "statistic");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "date",
                schema: "core",
                table: "statistic",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AddPrimaryKey(
                name: "PK_statistic",
                schema: "core",
                table: "statistic",
                columns: new[] { "user_id", "date" });
        }
    }
}
