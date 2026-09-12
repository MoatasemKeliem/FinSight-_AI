using System;
using finsight_ai.DTO.ResponseDTO.Simulate;
using finsight_ai.Entities;
using finsight_ai.Repositories;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.Service;

public class PredictService : IPredictService
{
    private readonly ApplicationDbContext _context;

    public PredictService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> DeletePrediction(string userId, string id)
    {
        var user = await _context.CompanyProfiles.FirstOrDefaultAsync(u => u.UserId == userId)
         ?? throw new UnauthorizedAccessException("Not Authorized");

        var prediction = await _context.PredictionAnalysis.FirstOrDefaultAsync(p => p.UserId == userId
        && p.Id == Guid.Parse(id)) ?? throw new KeyNotFoundException("Prediction Not Found");

        _context.PredictionAnalysis.Remove(prediction);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<PredictionAnalysisResponseDTO>> GetAllPredictions(string userId)
    {
        var predictions = await _context.PredictionAnalysis
                 .Where(p => p.UserId == userId)
                 .Select(p => new PredictionAnalysisResponseDTO
                 {
                     Id = p.Id,
                     Title = p.Title,
                     Description = p.Description,
                     PredictionsJson = p.PredictionsJson,
                     CreatedAt = p.CreatedAt
                 })
                 .ToListAsync();

        return predictions;
    }

    public async Task<PredictionAnalysisResponseDTO> GetPredictionById(string userId, string id)
    {
        var prediction = await _context.PredictionAnalysis
            .Where(p => p.UserId == userId && p.Id == Guid.Parse(id))
            .Select(p => new PredictionAnalysisResponseDTO
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                PredictionsJson = p.PredictionsJson,
                CreatedAt = p.CreatedAt
            })
            .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Prediction Not Found");

        return prediction;
    }
}
