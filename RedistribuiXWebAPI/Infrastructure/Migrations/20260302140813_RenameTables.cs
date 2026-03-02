using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Eveniment_Calendar",
                table: "Eveniment_Calendar");

            migrationBuilder.RenameTable(
                name: "Eveniment_Calendar",
                newName: "CalendarEvents");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CalendarEvents",
                table: "CalendarEvents",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CalendarEvents",
                table: "CalendarEvents");

            migrationBuilder.RenameTable(
                name: "CalendarEvents",
                newName: "Eveniment_Calendar");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Eveniment_Calendar",
                table: "Eveniment_Calendar",
                column: "Id");
        }
    }
}
