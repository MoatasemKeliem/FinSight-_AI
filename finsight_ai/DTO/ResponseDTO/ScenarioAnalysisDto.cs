using System;

namespace finsight_ai.DTO.ResponseDTO;

public class ScenarioAnalysisDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ScenarioSummary { get; set; } = string.Empty;
    public string FinancialImpactJson { get; set; } = string.Empty;
    public string QualitativeAnalysis { get; set; } = string.Empty;
    public string ChartUrl { get; set; } = string.Empty;
    public string FinalVerdict { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
