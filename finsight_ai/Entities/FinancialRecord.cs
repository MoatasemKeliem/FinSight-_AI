using System;
using finsight_ai.Entities.Enum;
using Microsoft.AspNetCore.Identity;

namespace finsight_ai.Entities;

public class FinancialRecord
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public IdentityUser? User { get; set; }
    public TypeEnum RecordType { get; set; }
    public decimal Amount { get; set; }
    public CategoryEnum Category { get; set; }
    public DateTime Date { get; set; }
    public SourceEnum Source { get; set; }

    //FK
    public Guid CompanyProfileId { get; set; }
    public CompanyProfile? CompanyProfile { get; set; }
}
