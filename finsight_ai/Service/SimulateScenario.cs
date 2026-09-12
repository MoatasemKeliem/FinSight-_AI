using System;
using finsight_ai.DTO.ResponseDTO;
using finsight_ai.Entities;
using finsight_ai.Repositories;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.Service;

public class SimulateScenario : ISimulateScenario
{
    private readonly ApplicationDbContext _context;

    public SimulateScenario(ApplicationDbContext context)
    {
        _context = context;

    }

    public async Task<bool> DeleteScenario(string userId, string id)
    {
        var user = await _context.CompanyProfiles.FirstOrDefaultAsync(u => u.UserId == userId)
              ?? throw new UnauthorizedAccessException("Not Authorized");

        var Scenario = await _context.ScenarioAnalyses.FirstOrDefaultAsync(p => p.UserId == userId
            && p.Id == Guid.Parse(id)) ?? throw new KeyNotFoundException("Scenario Not Found");

        _context.ScenarioAnalyses.Remove(Scenario);
        await _context.SaveChangesAsync();


        return true;
    }

    public async Task<List<ScenarioAnalysisDto>> GetAllScenarios(string userId)
    {
        var scenarios = await _context.ScenarioAnalyses
             .Where(p => p.UserId == userId)
             .Select(p => new ScenarioAnalysisDto
             {
                 Id = p.Id,
                 Title = p.Title,
                 ScenarioSummary = p.ScenarioSummary,
                 FinancialImpactJson = p.FinancialImpactJson,
                 QualitativeAnalysis = p.QualitativeAnalysis,
                 ChartUrl = p.ChartData,
                 FinalVerdict = p.FinalVerdict,
                 CreatedAt = p.CreatedAt
             })
             .ToListAsync();

        return scenarios;
    }

    public async Task<ScenarioAnalysis> GetScenarioById(string userId, string id)
    {
        var user = await _context.CompanyProfiles.FirstOrDefaultAsync(u => u.UserId == userId)
                   ?? throw new UnauthorizedAccessException("Not Authorized");

        var Scenario = await _context.ScenarioAnalyses.FirstOrDefaultAsync(p => p.UserId == userId
            && p.Id == Guid.Parse(id)) ?? throw new KeyNotFoundException("Scenario Not Found");


        return Scenario;
    }
}
