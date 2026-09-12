using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace finsight_ai.Migrations
{
    /// <inheritdoc />
    public partial class RenameChartUrlToChartData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ChartUrl",
                table: "ScenarioAnalyses",
                newName: "ChartData");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ChartData",
                table: "ScenarioAnalyses",
                newName: "ChartUrl");
        }
    }
}
