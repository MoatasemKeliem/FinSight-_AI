using System;
using finsight_ai.DTO;
using finsight_ai.DTO.ResponseDTO;
using finsight_ai.Entities;
using finsight_ai.Repositories;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.Service;

public class BusinessDecisionService : IBusinessDecision
{
    private readonly ApplicationDbContext _context;

    public BusinessDecisionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<BusinessDecisionResponseDto> CreateBusinessDecision(BusinessDecisionDto dto, string userId)
    {
        var existingCompany = await _context.CompanyProfiles.FirstOrDefaultAsync(c => c.UserId == userId)
         ?? throw new Exception();
        var CreatingBusinessDecision = new BusinessDecision
        {
            Title = dto.Title,
            Description = dto.Description,
            EstimatedCost = dto.EstimatedCost,
            ExpectedReturn = dto.ExpectedReturn,
            RiskLevel = dto.RiskLevel,
            UserId = userId,
            CompanyProfileId = existingCompany.Id,
            Date = DateTime.UtcNow
        };

        await _context.BusinessDecisions.AddAsync(CreatingBusinessDecision);
        await _context.SaveChangesAsync();

        return new BusinessDecisionResponseDto
        {
            Id = CreatingBusinessDecision.Id,
            Title = CreatingBusinessDecision.Title,
            Description = CreatingBusinessDecision.Description,
            EstimatedCost = CreatingBusinessDecision.ExpectedReturn,
            RiskLevel = CreatingBusinessDecision.RiskLevel
        };
    }

    public async Task<BusinessDecision> DeleteBusinessDecision(Guid Id, string userId)
    {
        if (Guid.Empty == Id) throw new KeyNotFoundException("ID is missing");

        var BusinessDecisionToDelete = await _context.BusinessDecisions
        .Where(bd => bd.Id == Id && bd.UserId == userId)
        .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Business decision not found");

        _context.BusinessDecisions.Remove(BusinessDecisionToDelete);
        await _context.SaveChangesAsync();

        return BusinessDecisionToDelete;
    }

    public async Task<List<BusinessDecision>> GetAllDecisions(string userId)
    {
        var BusinessDecision = await _context.BusinessDecisions
        .Where(bd => bd.UserId == userId)
        .ToListAsync();

        return BusinessDecision;
    }

    public async Task<BusinessDecision> GetDecisionById(Guid Id, string userId)
    {
        if (Guid.Empty == Id) throw new KeyNotFoundException("ID is missing");

        var BusinessDecision = await _context
        .BusinessDecisions.Where(bd => bd.Id == Id && bd.UserId == userId)
        .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Business decision not found");

        return BusinessDecision;
    }
    public async Task<BusinessDecision> UpdateBusinessDecision(Guid Id, BusinessDecisionDto dto, string userId)
    {
        if (Guid.Empty == Id) throw new KeyNotFoundException("ID is missing");

        var BusinessDecisionToUpdate = await _context
        .BusinessDecisions.Where(bd => bd.Id == Id && bd.UserId == userId)
        .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Business decision not found");

        BusinessDecisionToUpdate.Title = dto.Title;
        BusinessDecisionToUpdate.Description = dto.Description;
        BusinessDecisionToUpdate.EstimatedCost = dto.EstimatedCost;
        BusinessDecisionToUpdate.ExpectedReturn = dto.ExpectedReturn;
        BusinessDecisionToUpdate.RiskLevel = dto.RiskLevel;

        await _context.SaveChangesAsync();

        return BusinessDecisionToUpdate;
    }


    public async Task<BusinessDecision> SimulateBusinessDecision()
    {
        throw new NotImplementedException();
    }


}
