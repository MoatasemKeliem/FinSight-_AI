using System;
using System.IO;
using System.Text.Json;
using finsight_ai.Entities;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace finsight_ai.Service;

public class ReportService
{
    private readonly ApplicationDbContext _context;

    public ReportService(ApplicationDbContext context)
    {
        _context = context;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    private string ExtractCleanText(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return "No data available.";
        try
        {
            return JsonSerializer.Deserialize<string>(text) ?? text;
        }
        catch
        {
            return text;
        }
    }

    private string FormatTextArray(string jsonText)
    {
        if (string.IsNullOrWhiteSpace(jsonText)) return "No data available.";
        try
        {
            var array = JsonSerializer.Deserialize<List<string>>(jsonText);
            if (array != null && array.Count > 0)
            {
                return string.Join("\n\n", array);
            }
        }
        catch
        {
            try { return JsonSerializer.Deserialize<string>(jsonText) ?? jsonText; } catch { }
        }
        return jsonText;
    }

    private Action<QuestPDF.Infrastructure.IContainer> FormatRecommendations(string jsonText)
    {
        return container =>
        {
            if (string.IsNullOrWhiteSpace(jsonText))
            {
                container.Text("No recommendations available.").LineHeight(1.4f);
                return;
            }

            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                using var jsonDoc = JsonDocument.Parse(jsonText);
                var root = jsonDoc.RootElement;

                if (root.ValueKind == JsonValueKind.Array)
                {
                    container.Column(col =>
                    {
                        col.Spacing(8);
                        foreach (var item in root.EnumerateArray())
                        {
                            var title = item.TryGetProperty("action_title", out var titleProp) ? titleProp.GetString() : "Action Item";
                            var details = item.TryGetProperty("detailed_steps", out var detailsProp) ? detailsProp.GetString() : "";
                            var expected = item.TryGetProperty("expected_outcome", out var expectedProp) ? expectedProp.GetString() : "";

                            col.Item().Text(text =>
                            {
                                text.Span("• ").Bold();
                                text.Span(title + ": ").Bold();
                                text.Span(details).LineHeight(1.4f);

                                if (!string.IsNullOrEmpty(expected))
                                {
                                    text.Span($" (Outcome: {expected})").Italic().FontColor(QuestPDF.Helpers.Colors.Grey.Darken2);
                                }
                            });
                        }
                    });
                    return;
                }
            }
            catch
            {
            }

            container.Text(jsonText).LineHeight(1.4f);
        };
    }

    public async Task<byte[]> GenerateExecutiveSummaryPdf(string userId)
    {
        var company = await _context.CompanyProfiles.FirstOrDefaultAsync(c => c.UserId == userId)
            ?? throw new Exception("Company profile not found");

        var latestRisks = await _context.RiskAnalyses
            .Where(r => r.UserId == userId).OrderByDescending(r => r.CreatedAt).FirstOrDefaultAsync();

        var latestPrediction = await _context.PredictionAnalysis
            .Where(p => p.UserId == userId).OrderByDescending(p => p.CreatedAt).FirstOrDefaultAsync();

        var latestRecommendation = await _context.RecommendationAnalysis
            .Where(p => p.UserId == userId).OrderByDescending(p => p.CreatedAt).FirstOrDefaultAsync();

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.Grey.Darken3));

                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("FINSIGHT AI").FontSize(20).Bold().FontColor(Colors.Indigo.Darken3);
                        col.Item().Text($"Executive Financial Summary: {company.CompanyName}").FontSize(12).Bold();
                    });
                    row.ConstantItem(100).AlignRight().Column(col =>
                    {
                        col.Item().Text($"Date: {DateTime.UtcNow:yyyy-MM-dd}").FontSize(9).FontColor(Colors.Grey.Darken1);
                        col.Item().Text($"Currency: {company.Currency}").FontSize(9).FontColor(Colors.Grey.Darken1);
                    });
                });

                page.Content().PaddingTop(1, Unit.Centimetre).Column(column =>
                {
                    column.Spacing(15);

                    column.Item().Text("1. Financial Snapshot").FontSize(14).Bold().FontColor(Colors.Indigo.Darken2);
                    column.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Monthly Revenue").Bold();
                        table.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Monthly Costs").Bold();
                        table.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Estimated Net").Bold();

                        table.Cell().Padding(5).Text($"{company.MonthlyRevenue:N2} {company.Currency}");
                        table.Cell().Padding(5).Text($"{company.MonthlyCosts:N2} {company.Currency}");
                        var net = company.MonthlyRevenue - company.MonthlyCosts;
                        table.Cell().Padding(5).Text($"{net:N2} {company.Currency}").FontColor(net >= 0 ? Colors.Green.Darken2 : Colors.Red.Darken2);
                    });

                    if (latestRisks != null)
                    {
                        column.Item().Text("2. Key AI Risk Analysis Observations").FontSize(14).Bold().FontColor(Colors.Indigo.Darken2);
                        column.Item().PaddingBottom(5).Text(latestRisks.Title).Italic().FontSize(11);

                        column.Item().Text(FormatTextArray(latestRisks.Description)).LineHeight(1.4f);
                    }

                    if (latestPrediction != null)
                    {
                        column.Item().Text("3. 12-Month Predictive Trends").FontSize(14).Bold().FontColor(Colors.Indigo.Darken2);
                        column.Item().PaddingBottom(5).Text(latestPrediction.Title).Italic().FontSize(11);

                        column.Item().Text(FormatTextArray(latestPrediction.Description)).LineHeight(1.4f);
                    }

                    if (latestRecommendation != null)
                    {
                        column.Item().Text("4. Actionable Strategic Recommendations").FontSize(14).Bold().FontColor(Colors.Indigo.Darken2);
                        column.Item().PaddingBottom(5).Text(latestRecommendation.Title).Bold().FontSize(11);

                        column.Item().Element(FormatRecommendations(latestRecommendation.Description));
                    }

                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
        });

        using var stream = new MemoryStream();
        document.GeneratePdf(stream);
        return stream.ToArray();
    }
}