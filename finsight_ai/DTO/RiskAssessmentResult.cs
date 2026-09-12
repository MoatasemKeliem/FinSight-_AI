using System;
using System.Text.Json.Serialization;

namespace finsight_ai.DTO;

public class RiskAssessmentResult
{
    public string Title { get; set; } = string.Empty;
    public List<string> Description { get; set; } = new List<string>();
    public List<RiskItemDto>? Risks { get; set; }
}

public class PredictionAssessmentResult
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public List<string> Description { get; set; } = new();

    [JsonPropertyName("predictions")]
    public List<PredictionDetail> Predictions { get; set; } = new();
}

public class PredictionDetail
{
    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;

    [JsonPropertyName("prediction_title")]
    public string PredictionTitle { get; set; } = string.Empty;

    [JsonPropertyName("details")]
    public string Details { get; set; } = string.Empty;

    [JsonPropertyName("impact_level")]
    public string ImpactLevel { get; set; } = string.Empty;

    [JsonPropertyName("timeframe")]
    public string Timeframe { get; set; } = string.Empty;
}

public class RecommendationAssessmentResult
{
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("executive_summary")]
    public string ExecutiveSummary { get; set; } = string.Empty;

    public object Recommendations { get; set; } = string.Empty;
}
public class RiskItemDto
{
    public string Type { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Observation { get; set; } = string.Empty;
    public string Recommendation { get; set; } = string.Empty;
}

public class ChartDataDto
{
    [JsonPropertyName("x_axis_label")]
    public string XAxisLabel { get; set; } = string.Empty;

    [JsonPropertyName("y_axis_label")]
    public string YAxisLabel { get; set; } = string.Empty;

    [JsonPropertyName("labels")]
    public List<string> Labels { get; set; } = new();

    [JsonPropertyName("data")]
    public List<double> Data { get; set; } = new();
}

public class ScenarioAssessmentResult
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("scenario_summary")]
    public string ScenarioSummary { get; set; } = string.Empty;

    [JsonPropertyName("financial_impact")]
    public FinancialImpactData FinancialImpact { get; set; } = new();

    [JsonPropertyName("chart_data")]
    public ChartDataDto ChartData { get; set; } = new();

    [JsonPropertyName("final_verdict")]
    public string FinalVerdict { get; set; } = string.Empty;

    [JsonPropertyName("qualitative_analysis")]
    public string QualitativeAnalysis { get; set; } = string.Empty;
}

public class FinancialImpactData
{
    [JsonPropertyName("baseline_monthly_net")]
    public string BaselineMonthlyNet { get; set; } = string.Empty;

    [JsonPropertyName("projected_monthly_net")]
    public string ProjectedMonthlyNet { get; set; } = string.Empty;

    [JsonPropertyName("runway_impact")]
    public string RunwayImpact { get; set; } = string.Empty;
}

