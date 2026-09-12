using System;
using finsight_ai.DTO;
using finsight_ai.Entities;

namespace finsight_ai.Repositories;

public interface ICompanyProfile
{
    public Task<CompanyProfile> CreateCompanyProfile(CompanyProfileDto dto, string userId);
    public Task<CompanyProfile> GetCompanyProfile(Guid Id, string userId);
    public Task<List<CompanyProfile>> GetCompanyProfileByUserId(string userId);
    public Task<CompanyProfile> UpdateCompanyProfile(Guid Id, CompanyProfileDto dto, string userId);
    public Task<bool> DeleteCompanyProfile(Guid Id, string userId);
}
