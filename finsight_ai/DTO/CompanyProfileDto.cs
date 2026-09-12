using System;
using finsight_ai.Entities.Enum;

namespace finsight_ai.DTO;

public class CompanyProfileDto
{
    public string CompanyName { get; set; } = string.Empty;
    public decimal MonthlyRevenue { get; set; }
    public decimal MonthlyCosts { get; set; }
    public IndustryEnum Industry { get; set; }

    public CurrencyEnum Currency { get; set; }

}
