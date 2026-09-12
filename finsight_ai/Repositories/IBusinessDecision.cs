using System;
using finsight_ai.DTO;
using finsight_ai.DTO.ResponseDTO;
using finsight_ai.Entities;

namespace finsight_ai.Repositories;

public interface IBusinessDecision
{
    Task<BusinessDecisionResponseDto> CreateBusinessDecision(BusinessDecisionDto dto, string userId);
    Task<List<BusinessDecision>> GetAllDecisions(string userId);
    Task<BusinessDecision> GetDecisionById(Guid Id, string userId);
    Task<BusinessDecision> UpdateBusinessDecision(Guid Id, BusinessDecisionDto dto, string userId);
    Task<BusinessDecision> DeleteBusinessDecision(Guid Id, string userId);
    Task<BusinessDecision> SimulateBusinessDecision();
}
