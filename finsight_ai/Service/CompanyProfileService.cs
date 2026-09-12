using System;
using finsight_ai.DTO;
using finsight_ai.Entities;
using finsight_ai.Exceptions;
using finsight_ai.Repositories;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.Service;

public class CompanyProfileService : ICompanyProfile
{
    private readonly ApplicationDbContext _context;

    public CompanyProfileService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CompanyProfile> CreateCompanyProfile(CompanyProfileDto dto, string userId)
    {
        var companyProfile = new CompanyProfile
        {
            CompanyName = dto.CompanyName,
            MonthlyRevenue = dto.MonthlyRevenue,
            MonthlyCosts = dto.MonthlyCosts,
            Industry = dto.Industry,
            Currency = dto.Currency,
            UserId = userId
        };

        await _context.CompanyProfiles.AddAsync(companyProfile);
        await _context.SaveChangesAsync();

        return companyProfile;
    }

    public async Task<bool> DeleteCompanyProfile(Guid Id, string userId)
    {
        if (Guid.Empty == Id) throw new BadRequestException("ID is missing");

        var companyProfileToDelete = await _context.CompanyProfiles
         .FirstOrDefaultAsync(cprofile => cprofile.Id == Id && cprofile.UserId == userId) ??
          throw new NotFoundException("Company profile not found");

        _context.CompanyProfiles.Remove(companyProfileToDelete);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<CompanyProfile> GetCompanyProfile(Guid Id, string userId)
    {
        if (Guid.Empty == Id) throw new BadRequestException("ID is missing");

        var companyProfile = await _context.CompanyProfiles
        .FirstOrDefaultAsync(cprofile => cprofile.Id == Id && cprofile.UserId == userId) ??
         throw new NotFoundException("Company profile not found");


        return companyProfile;
    }

    public async Task<List<CompanyProfile>> GetCompanyProfileByUserId(string userId)
    {

        var companyProfiles = await _context.CompanyProfiles
        .Where(cprofile => cprofile.UserId == userId).ToListAsync() ??
         throw new NotFoundException("Company profile not found");

        return companyProfiles;
    }

    public async Task<CompanyProfile> UpdateCompanyProfile(Guid Id, CompanyProfileDto dto, string userId)
    {
        if (Guid.Empty == Id) throw new BadRequestException("ID is missing");

        var companyProfileToUpdate = await _context.CompanyProfiles
          .FirstOrDefaultAsync(cprofile => cprofile.Id == Id && cprofile.UserId == userId) ??
           throw new NotFoundException("Company profile not found");

        companyProfileToUpdate.CompanyName = dto.CompanyName;
        companyProfileToUpdate.MonthlyRevenue = dto.MonthlyRevenue;
        companyProfileToUpdate.MonthlyCosts = dto.MonthlyCosts;
        companyProfileToUpdate.Industry = dto.Industry;
        companyProfileToUpdate.Currency = dto.Currency;

        await _context.SaveChangesAsync();

        return companyProfileToUpdate;

    }
}
