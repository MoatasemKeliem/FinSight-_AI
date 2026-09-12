using System;
using finsight_ai.Entities;

namespace finsight_ai.Repositories;

public interface IAIAnalysis
{
    Task<List<AIAnalysis>> GetAllInsight(string userId);
    Task<AIAnalysis> GetInsightById(Guid Id, string userId);
    Task<bool> DeleteAllInsight(Guid Id, string userId);
    Task<AIAnalysis> GenerateInsight(string userId);
}
