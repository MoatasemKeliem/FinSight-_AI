using System;
using finsight_ai.DTO;
using finsight_ai.DTO.ResponseDTO;
using finsight_ai.DTO.ResponseDTO.Simulate;

namespace finsight_ai.Repositories;

public interface IAiService
{
    // RAG
    Task<string> ChatAsync(ChatDto dto, string userId);
    // MCP 
    Task<string> SimulateScenarioAsync(string userId, string scenario);
    // MULTI-AGENT (Group chat, Hand off or Sqeuntial) and MCP
    Task<string> PredictAsync(string userId, string type);
    // MULTI-AGENT
    Task<string> RecommendationsAI(string userId);
    // MULTI-AGENT (Sqeuntial)
    Task<string> AnalyzeRiskAsync(string userId);
}
