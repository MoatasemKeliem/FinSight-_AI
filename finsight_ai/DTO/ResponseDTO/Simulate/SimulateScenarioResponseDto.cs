using System;

namespace finsight_ai.DTO.ResponseDTO;

public class SimulateScenarioResponseDto
{
    // Övergripande sammanfattning av simuleringen
    public string Summary { get; set; } = string.Empty;

    // Detaljerad analys (Markdown-stöd rekommenderas för frontend)
    public string DetailedAnalysis { get; set; } = string.Empty;

    // En risknivå eller påverkansgrad (t.ex. 1-10 eller Low/Medium/High)
    public string ImpactLevel { get; set; } = string.Empty;

    // Specifika mätvärden som förändras i scenariot (t.ex. Likviditet: -15%)
    public List<ScenarioMetric> ProjectedMetrics { get; set; } = new();

    // Rekommenderade åtgärder baserat på simuleringen
    public List<ActionPlan> Recommendations { get; set; } = new();

    // Spårbarhet: Vilken branschdata hämtades via MCP?
    public List<ExternalSource> ContextSources { get; set; } = new();

    // Metadata för UI (t.ex. grafer)
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class ScenarioMetric
{
    public string Label { get; set; } = string.Empty; // t.p. "Vinstmarginal"
    public string CurrentValue { get; set; } = string.Empty;
    public string ProjectedValue { get; set; } = string.Empty;
    public double ChangePercentage { get; set; }
    public bool IsPositive { get; set; } // För att visa grönt/rött i UI
}

public class ActionPlan
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty; // High, Medium, Low
}

public class ExternalSource
{
    public string Provider { get; set; } = string.Empty; // t.ex. "MCP: Yahoo Finance"
    public string Title { get; set; } = string.Empty;    // t.ex. "Ränteprognos Q3 2026"
    public DateTime FetchedAt { get; set; } = DateTime.UtcNow;
}