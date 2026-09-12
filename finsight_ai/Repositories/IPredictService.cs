using System;
using finsight_ai.DTO.ResponseDTO.Simulate;
using finsight_ai.Entities;

namespace finsight_ai.Repositories;

public interface IPredictService
{
    public Task<List<PredictionAnalysisResponseDTO>> GetAllPredictions(string userId);
    public Task<PredictionAnalysisResponseDTO> GetPredictionById(string userId, string id);
    public Task<bool> DeletePrediction(string userId, string id);

}
