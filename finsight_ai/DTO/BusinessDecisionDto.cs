using System;
using finsight_ai.Entities.Enum;

namespace finsight_ai.DTO;

public class BusinessDecisionDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal EstimatedCost { get; set; }
    public decimal ExpectedReturn { get; set; }
    public RiskLevelEnum RiskLevel { get; set; }

}
