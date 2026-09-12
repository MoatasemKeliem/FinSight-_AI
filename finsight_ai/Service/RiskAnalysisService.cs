using System;
using finsight_ai.Entities;
using finsight_ai.Exceptions;
using finsight_ai.Repositories;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.Service;

public class RiskAnalysisService : IRiskAnalysis
{
    private readonly ApplicationDbContext _context;

    public RiskAnalysisService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task DeleteRiskAnalysById(Guid Id, string userId)
    {
        var AnalysisToDelete = await _context.RiskAnalyses.Where(ra => ra.UserId == userId && ra.Id == Id)
        .FirstOrDefaultAsync() ?? throw new NotFoundException("Couldn't find analysis");

        _context.RiskAnalyses.Remove(AnalysisToDelete);
        await _context.SaveChangesAsync();
    }

    public async Task<List<RiskAnalysis>> GetAllRiskAnalysis(string userId)
    {
        var AllAnalysis = await _context.RiskAnalyses.Where(ra => ra.UserId == userId)
              .ToListAsync() ?? throw new NotFoundException("Couldn't find analysis");

        return AllAnalysis;
    }

    public async Task<RiskAnalysis> GetRiskAnalysById(Guid Id, string userId)
    {
        var Analysis = await _context.RiskAnalyses.Where(ra => ra.UserId == userId && ra.Id == Id)
       .FirstOrDefaultAsync() ?? throw new NotFoundException("Couldn't find analysis");

        return Analysis;
    }
}
