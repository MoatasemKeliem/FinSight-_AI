using System;
using finsight_ai.Entities.Enum;
using Microsoft.AspNetCore.Identity;

namespace finsight_ai.Entities;

public class CompanyProfile
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public IdentityUser? User { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public IndustryEnum Industry { get; set; }
    public decimal MonthlyRevenue { get; set; }
    public decimal MonthlyCosts { get; set; }
    public CurrencyEnum Currency { get; set; }
    public ICollection<FinancialRecord> FinancialRecords { get; set; } = new List<FinancialRecord>();
    public ICollection<CashFlowSnapshot> CashFlowSnapshots { get; set; } = new List<CashFlowSnapshot>();
    public ICollection<BusinessDecision> BusinessDecisions { get; set; } = new List<BusinessDecision>();
    public ICollection<AIAnalysis> AIAnalyses { get; set; } = new List<AIAnalysis>();
    public ICollection<RiskAnalysis> RiskAnalysis { get; set; } = new List<RiskAnalysis>();
    public ICollection<PredictionAnalysis> PredictionAnalyses { get; set; } = new List<PredictionAnalysis>();
    public ICollection<RecommendationAnalysis> RecommendationAnalyses { get; set; } = new List<RecommendationAnalysis>();
    public ICollection<ScenarioAnalysis> ScenarioAnalyses { get; set; } = new List<ScenarioAnalysis>();
    public ICollection<UploadedDocument> UploadedDocuments { get; set; } = new List<UploadedDocument>();

}
