using System;
using finsight_ai.DTO.ResponseDTO;
using finsight_ai.Entities;

namespace finsight_ai.Repositories;

public interface ISimulateScenario
{
    public Task<List<ScenarioAnalysisDto>> GetAllScenarios(string userId);
    public Task<bool> DeleteScenario(string userId, string id);
    public Task<ScenarioAnalysis> GetScenarioById(string userId, string id);
}
