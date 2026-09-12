using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace finsight_ai.Migrations
{
    /// <inheritdoc />
    public partial class added_entities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AIAnalysis_AspNetUsers_UserId",
                table: "AIAnalysis");

            migrationBuilder.DropForeignKey(
                name: "FK_AIAnalysis_CompanyProfiles_CompanyProfileId",
                table: "AIAnalysis");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskAnalysis_CompanyProfiles_CompanyProfileId",
                table: "RiskAnalysis");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RiskAnalysis",
                table: "RiskAnalysis");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AIAnalysis",
                table: "AIAnalysis");

            migrationBuilder.RenameTable(
                name: "RiskAnalysis",
                newName: "RiskAnalyses");

            migrationBuilder.RenameTable(
                name: "AIAnalysis",
                newName: "AIAnalyses");

            migrationBuilder.RenameIndex(
                name: "IX_RiskAnalysis_CompanyProfileId",
                table: "RiskAnalyses",
                newName: "IX_RiskAnalyses_CompanyProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_AIAnalysis_UserId",
                table: "AIAnalyses",
                newName: "IX_AIAnalyses_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_AIAnalysis_CompanyProfileId",
                table: "AIAnalyses",
                newName: "IX_AIAnalyses_CompanyProfileId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RiskAnalyses",
                table: "RiskAnalyses",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AIAnalyses",
                table: "AIAnalyses",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "PredictionAnalysis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    PredictionsJson = table.Column<string>(type: "text", nullable: false),
                    CompanyProfileId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PredictionAnalysis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PredictionAnalysis_CompanyProfiles_CompanyProfileId",
                        column: x => x.CompanyProfileId,
                        principalTable: "CompanyProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecommendationAnalysis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    RecommendationJson = table.Column<string>(type: "text", nullable: false),
                    CompanyProfileId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecommendationAnalysis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecommendationAnalysis_CompanyProfiles_CompanyProfileId",
                        column: x => x.CompanyProfileId,
                        principalTable: "CompanyProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ScenarioAnalyses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ScenarioSummary = table.Column<string>(type: "text", nullable: false),
                    FinancialImpactJson = table.Column<string>(type: "text", nullable: false),
                    QualitativeAnalysis = table.Column<string>(type: "text", nullable: false),
                    ChartUrl = table.Column<string>(type: "text", nullable: false),
                    FinalVerdict = table.Column<string>(type: "text", nullable: false),
                    CompanyProfileId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScenarioAnalyses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScenarioAnalyses_CompanyProfiles_CompanyProfileId",
                        column: x => x.CompanyProfileId,
                        principalTable: "CompanyProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PredictionAnalysis_CompanyProfileId",
                table: "PredictionAnalysis",
                column: "CompanyProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_RecommendationAnalysis_CompanyProfileId",
                table: "RecommendationAnalysis",
                column: "CompanyProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioAnalyses_CompanyProfileId",
                table: "ScenarioAnalyses",
                column: "CompanyProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_AIAnalyses_AspNetUsers_UserId",
                table: "AIAnalyses",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AIAnalyses_CompanyProfiles_CompanyProfileId",
                table: "AIAnalyses",
                column: "CompanyProfileId",
                principalTable: "CompanyProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskAnalyses_CompanyProfiles_CompanyProfileId",
                table: "RiskAnalyses",
                column: "CompanyProfileId",
                principalTable: "CompanyProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AIAnalyses_AspNetUsers_UserId",
                table: "AIAnalyses");

            migrationBuilder.DropForeignKey(
                name: "FK_AIAnalyses_CompanyProfiles_CompanyProfileId",
                table: "AIAnalyses");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskAnalyses_CompanyProfiles_CompanyProfileId",
                table: "RiskAnalyses");

            migrationBuilder.DropTable(
                name: "PredictionAnalysis");

            migrationBuilder.DropTable(
                name: "RecommendationAnalysis");

            migrationBuilder.DropTable(
                name: "ScenarioAnalyses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RiskAnalyses",
                table: "RiskAnalyses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AIAnalyses",
                table: "AIAnalyses");

            migrationBuilder.RenameTable(
                name: "RiskAnalyses",
                newName: "RiskAnalysis");

            migrationBuilder.RenameTable(
                name: "AIAnalyses",
                newName: "AIAnalysis");

            migrationBuilder.RenameIndex(
                name: "IX_RiskAnalyses_CompanyProfileId",
                table: "RiskAnalysis",
                newName: "IX_RiskAnalysis_CompanyProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_AIAnalyses_UserId",
                table: "AIAnalysis",
                newName: "IX_AIAnalysis_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_AIAnalyses_CompanyProfileId",
                table: "AIAnalysis",
                newName: "IX_AIAnalysis_CompanyProfileId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RiskAnalysis",
                table: "RiskAnalysis",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AIAnalysis",
                table: "AIAnalysis",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AIAnalysis_AspNetUsers_UserId",
                table: "AIAnalysis",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AIAnalysis_CompanyProfiles_CompanyProfileId",
                table: "AIAnalysis",
                column: "CompanyProfileId",
                principalTable: "CompanyProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskAnalysis_CompanyProfiles_CompanyProfileId",
                table: "RiskAnalysis",
                column: "CompanyProfileId",
                principalTable: "CompanyProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
