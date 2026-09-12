using System;

namespace finsight_ai.Entities;

public class PredictionAnalysis
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string PredictionsJson { get; set; } = string.Empty;

    public Guid CompanyProfileId { get; set; }

    public CompanyProfile? CompanyProfile { get; set; }
}
