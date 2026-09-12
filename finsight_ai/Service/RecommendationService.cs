using System;
using finsight_ai.Entities;
using finsight_ai.Repositories;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.Service;

public class RecommendationService : IRecommendationService
{
    private readonly ApplicationDbContext _context;

    public RecommendationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> DeleteRecommendation(string userId, string id)
    {
        var user = await _context.CompanyProfiles.FirstOrDefaultAsync(u => u.UserId == userId)
               ?? throw new UnauthorizedAccessException("Not Authorized");

        var Recommendation = await _context.RecommendationAnalysis.FirstOrDefaultAsync(p => p.UserId == userId
        && p.Id == Guid.Parse(id)) ?? throw new KeyNotFoundException("Recommendation Not Found");

        _context.RecommendationAnalysis.Remove(Recommendation);
        await _context.SaveChangesAsync();


        return true;
    }

    public async Task<List<RecommendationAnalysis>> GetAllRecommendations(string userId)
    {
        var user = await _context.CompanyProfiles.FirstOrDefaultAsync(u => u.UserId == userId)
                       ?? throw new UnauthorizedAccessException("Not Authorized");

        var Recommendations = await _context.RecommendationAnalysis.Where(p => p.UserId == userId).ToListAsync()
        ?? throw new KeyNotFoundException("Recommendations Not Found");

        return Recommendations;
    }

    public async Task<RecommendationAnalysis> GetRecommendationById(string userId, string id)
    {
        var user = await _context.CompanyProfiles.FirstOrDefaultAsync(u => u.UserId == userId)
                     ?? throw new UnauthorizedAccessException("Not Authorized");

        var Recommendation = await _context.RecommendationAnalysis.FirstOrDefaultAsync(p => p.UserId == userId
        && p.Id == Guid.Parse(id)) ?? throw new KeyNotFoundException("Recommendation Not Found");

        return Recommendation;
    }
}
