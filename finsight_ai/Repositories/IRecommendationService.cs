using System;
using finsight_ai.Entities;

namespace finsight_ai.Repositories;

public interface IRecommendationService
{
    public Task<List<RecommendationAnalysis>> GetAllRecommendations(string userId);
    public Task<bool> DeleteRecommendation(string userId, string id);
    public Task<RecommendationAnalysis> GetRecommendationById(string userId, string id);
}
