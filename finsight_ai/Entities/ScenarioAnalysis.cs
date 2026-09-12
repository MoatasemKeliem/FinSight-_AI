using System;

namespace finsight_ai.Entities;

public class ScenarioAnalysis
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public string Title { get; set; } = string.Empty;

    public string ScenarioSummary { get; set; } = string.Empty;

    public string FinancialImpactJson { get; set; } = string.Empty;

    public string QualitativeAnalysis { get; set; } = string.Empty;

    public string ChartData { get; set; } = string.Empty;

    public string FinalVerdict { get; set; } = string.Empty;

    public Guid CompanyProfileId { get; set; }

    public CompanyProfile? CompanyProfile { get; set; }
}
