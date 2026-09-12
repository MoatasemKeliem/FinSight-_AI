using System;
using finsight_ai.Entities.Enum;
using Microsoft.AspNetCore.Identity;

namespace finsight_ai.Entities;

public class CashFlowSnapshot
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public IdentityUser? User { get; set; }
    public MonthEnum Month { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal NetCashFlow { get; set; }
    public DateOnly Date { get; set; }

    public Guid CompanyProfileId { get; set; }
    public CompanyProfile? CompanyProfile { get; set; }
}
