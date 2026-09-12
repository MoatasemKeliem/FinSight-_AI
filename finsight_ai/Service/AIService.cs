using System;
using System.Text.Json;
using finsight_ai.AgentBuilder;
using finsight_ai.DTO;
using finsight_ai.DTO.ResponseDTO;
using finsight_ai.DTO.ResponseDTO.Simulate;
using finsight_ai.Entities;
using finsight_ai.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace finsight_ai.Service;

public class AIService : IAiService
{

    private readonly ApplicationDbContext _context;
    private readonly Kernel _kernel;
    private readonly AnalyzeRiskAI _analyzeRisk;
    private readonly FinancialDataContext _dataBuilder;
    private readonly PredictAI _predictAI;
    private readonly RecommendationsAI _recommendationsAI;
    private readonly ScenarioAI _scenarioAI;

    public AIService(ApplicationDbContext context, Kernel kernel, AnalyzeRiskAI analyzeRisk,
     FinancialDataContext dataBuilder, PredictAI predictAI, RecommendationsAI recommendationsAI, ScenarioAI scenarioAI)
    {
        _context = context;
        _kernel = kernel;
        _analyzeRisk = analyzeRisk;
        _dataBuilder = dataBuilder;
        _predictAI = predictAI;
        _recommendationsAI = recommendationsAI;
        _scenarioAI = scenarioAI;
    }

    public async Task<string> AnalyzeRiskAsync(string userId)
    {
        var JsonResult = await _analyzeRisk.AnalyzeRisk(userId);
        var company = await _context.CompanyProfiles
        .FirstOrDefaultAsync(x => x.UserId == userId);

        if (company == null)
        {
            throw new Exception("CompanyProfile not found");
        }

        try
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var parsedResult = JsonSerializer.Deserialize<RiskAssessmentResult>(JsonResult, options);

            if (parsedResult != null)
            {
                var analysisRecord = new RiskAnalysis
                {
                    UserId = userId,
                    Title = parsedResult.Title,
                    Description = JsonSerializer.Serialize(parsedResult.Description),
                    RisksJson = JsonSerializer.Serialize(parsedResult.Risks),
                    CompanyProfileId = company.Id,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.RiskAnalyses.AddAsync(analysisRecord);
                await _context.SaveChangesAsync();
            }

        }
        catch (System.Exception ex)
        {
            Console.WriteLine($"Database save failed: {ex.Message}");
            throw;
        }

        return JsonResult;
    }
    public async Task<string> ChatAsync(ChatDto dto, string userId)
    {
        var context = await _dataBuilder.BuildDataContext(userId);
        var ComapnyData = await _context.CompanyProfiles.
       FirstOrDefaultAsync(u => u.UserId == userId) ??
        throw new Exception("CompanyProfile not found");

        var chatService = _kernel.GetRequiredService<IChatCompletionService>();
        var chatHistory = new ChatHistory();


        chatHistory.AddSystemMessage(Prompts.AIPrompts.ChatSystemPrompt(context));

        chatHistory.AddSystemMessage(Prompts.AIPrompts.ChatRulesInstructions());

        chatHistory.AddUserMessage(Prompts.AIPrompts.ChatUserMessage(dto.Message));

        var result = await chatService.GetChatMessageContentAsync(chatHistory);
        chatHistory.AddAssistantMessage(result.Content!);

        return result.Content!;
    }

    public async Task<string> PredictAsync(string userId, string type)
    {
        var Predict = await _predictAI.Predict(userId);
        var ComapnyData = await _context.CompanyProfiles.
        FirstOrDefaultAsync(u => u.UserId == userId) ??
         throw new Exception("CompanyProfile not found");

        try
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var parsedResult = JsonSerializer.Deserialize<PredictionAssessmentResult>(Predict, options);

            if (parsedResult != null)
            {
                var predictRecord = new PredictionAnalysis
                {
                    UserId = userId,
                    Title = parsedResult.Title,
                    Description = JsonSerializer.Serialize(parsedResult.Description),
                    CompanyProfileId = ComapnyData.Id,
                    PredictionsJson = JsonSerializer.Serialize(parsedResult.Predictions),
                    CreatedAt = DateTime.UtcNow,
                };

                await _context.PredictionAnalysis.AddAsync(predictRecord);
                await _context.SaveChangesAsync();

                // return new PredictionAnalysisResponseDTO
                // {
                //     Id = predictRecord.Id,
                //     Title = predictRecord.Title,
                //     Description = predictRecord.Description,
                //     CreatedAt = predictRecord.CreatedAt
                // };
            }
            // throw new Exception("Failed to parse prediction AI output.");
        }
        catch (System.Exception ex)
        {
            Console.WriteLine($"Database save failed: {ex.Message}");
            throw;
        }

        return Predict;
    }

    public async Task<string> RecommendationsAI(string userId)
    {
        var Recommendations = await _recommendationsAI.RecommendActivicty(userId);
        var ComapnyData = await _context.CompanyProfiles.
       FirstOrDefaultAsync(u => u.UserId == userId) ??
        throw new Exception("CompanyProfile not found");

        try
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var parsedResult = JsonSerializer.Deserialize<RecommendationAssessmentResult>(Recommendations, options);

            if (parsedResult != null)
            {
                var recommendationRecord = new RecommendationAnalysis
                {
                    UserId = userId,
                    Title = parsedResult.Title,
                    Description = JsonSerializer.Serialize(parsedResult.Recommendations),
                    CompanyProfileId = ComapnyData.Id,
                    CreatedAt = DateTime.UtcNow,
                    RecommendationJson = Recommendations
                };

                await _context.RecommendationAnalysis.AddAsync(recommendationRecord);
                await _context.SaveChangesAsync();
            }
        }
        catch (System.Exception ex)
        {

            Console.WriteLine($"Database save failed: {ex.Message}");
            throw;
        }

        return Recommendations;
    }

    public async Task<string> SimulateScenarioAsync(string userId, string scenario)
    {
        var AIScenario = await _scenarioAI.SimulateScenarioAI(userId, scenario);
        var ComapnyData = await _context.CompanyProfiles.
       FirstOrDefaultAsync(u => u.UserId == userId) ??
        throw new Exception("CompanyProfile not found");
        var data = await _dataBuilder.BuildDataContext(userId);

        try
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var parsedResult = JsonSerializer.Deserialize<ScenarioAssessmentResult>(AIScenario, options);

            if (parsedResult != null)
            {
                var ScenarioRecord = new ScenarioAnalysis
                {
                    UserId = userId,
                    Title = parsedResult.Title,
                    ScenarioSummary = parsedResult.ScenarioSummary,
                    CompanyProfileId = ComapnyData.Id,
                    FinancialImpactJson = JsonSerializer.Serialize(parsedResult.FinancialImpact),
                    QualitativeAnalysis = parsedResult.QualitativeAnalysis,
                    ChartData = JsonSerializer.Serialize(parsedResult.ChartData),
                    FinalVerdict = parsedResult.FinalVerdict,
                    CreatedAt = DateTime.UtcNow,
                };

                await _context.ScenarioAnalyses.AddAsync(ScenarioRecord);
                await _context.SaveChangesAsync();
            }
        }
        catch (System.Exception ex)
        {

            Console.WriteLine($"Database save failed: {ex.Message}");
            throw;
        }

        return AIScenario;
    }
}
