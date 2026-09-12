using System;
using finsight_ai.Entities.Enum;
using Microsoft.AspNetCore.Identity;

namespace finsight_ai.Entities;

public class AIAnalysis
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public IdentityUser? User { get; set; }
    public ContextTypeEnum ContextType { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public Guid CompanyProfileId { get; set; }
    public CompanyProfile? CompanyProfile { get; set; }
}
