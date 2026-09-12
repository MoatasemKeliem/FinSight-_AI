using System;
using System.Text.Json;
using finsight_ai.Entities;
using finsight_ai.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;

namespace finsight_ai.Service;

public class AIInsightService : IAIAnalysis
{
    private readonly ApplicationDbContext _context;
    private readonly Kernel _kernel;

    public AIInsightService(ApplicationDbContext context, Kernel kernel)
    {
        _context = context;
        _kernel = kernel;
    }

    public async Task<bool> DeleteAllInsight(Guid Id, string userId)
    {
        if (Guid.Empty == Id) throw new KeyNotFoundException("ID is missing");

        var AiInsightToDelete = await _context.AIAnalyses
          .Where(fr => fr.Id == Id && fr.UserId == userId)
          .FirstOrDefaultAsync()
          ?? throw new KeyNotFoundException("Couldn't find AI analysis");

        _context.AIAnalyses.Remove(AiInsightToDelete);
        await _context.SaveChangesAsync();

        return true;
    }


    public async Task<List<AIAnalysis>> GetAllInsight(string userId)
    {
        var AllAiInsight = await _context.AIAnalyses
             .Where(fr => fr.UserId == userId)
             .ToListAsync();

        return AllAiInsight;
    }

    public async Task<AIAnalysis> GetInsightById(Guid Id, string userId)
    {
        if (Guid.Empty == Id) throw new KeyNotFoundException("ID is missing");

        var AiInsightById = await _context.AIAnalyses
          .Where(fr => fr.Id == Id && fr.UserId == userId)
          .FirstOrDefaultAsync()
          ?? throw new KeyNotFoundException("Couldn't find AI analysis");

        return AiInsightById;
    }

    public async Task<AIAnalysis> GenerateInsight(string userId)
    {
        var financialData = await _context.FinancialRecords
       .Where(x => x.UserId == userId)
       .ToListAsync();

        var cashFlow = await _context.CashFlowSnapshots
            .Where(x => x.UserId == userId)
            .ToListAsync();

        var decisions = await _context.BusinessDecisions
            .Where(x => x.UserId == userId)
            .ToListAsync();

        var previousInsights = await _context.AIAnalyses
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Take(5)
            .ToListAsync();

        var financialJson = JsonSerializer.Serialize(financialData);
        var cashFlowJson = JsonSerializer.Serialize(cashFlow);
        var decisionsJson = JsonSerializer.Serialize(decisions);
        var insightsJson = JsonSerializer.Serialize(previousInsights);

        var prompt = $@"
    You are a CFO AI.

    Financial Data:
    {financialJson}

    Cash Flow:
    {cashFlowJson}

    Decisions:
    {decisionsJson}

    Previous Insights:
    {insightsJson}

    Give:
    - Risks
    - Opportunities
    - Cost inefficiencies
    ";

        var Ai_response = await _kernel.InvokePromptAsync(prompt);

        var analysis = new AIAnalysis
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Content = Ai_response.ToString(),
            CreatedAt = DateTime.UtcNow
        };

        await _context.AIAnalyses.AddAsync(analysis);
        await _context.SaveChangesAsync();

        return analysis;
    }
}
