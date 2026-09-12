using System;
using finsight_ai.Entities.Enum;
using Microsoft.AspNetCore.Identity;

namespace finsight_ai.Entities;

public class BusinessDecision
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public IdentityUser? User { get; set; }
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal EstimatedCost { get; set; }
    public decimal ExpectedReturn { get; set; }
    public RiskLevelEnum RiskLevel { get; set; }
    public DateTime Date { get; set; }

    // FK

    public Guid CompanyProfileId { get; set; }
    public CompanyProfile? CompanyProfile { get; set; }
}