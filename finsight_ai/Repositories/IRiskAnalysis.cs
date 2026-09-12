using System;
using finsight_ai.Entities;

namespace finsight_ai.Repositories;

public interface IRiskAnalysis
{
    Task<List<RiskAnalysis>> GetAllRiskAnalysis(string userId);
    Task<RiskAnalysis> GetRiskAnalysById(Guid Id, string userId);
    Task DeleteRiskAnalysById(Guid Id, string userId);
}
