using System;
using finsight_ai.DTO;
using finsight_ai.DTO.ResponseDTO;
using finsight_ai.Entities;

namespace finsight_ai.Repositories;

public interface IFinancialRecord
{
    Task<FinancialRecordResponseDto> CreateFinancalRecord(FinancalRecordDto dto, string userId);
    Task<List<FinancialRecord>> GetAllFinancalRecords(string userId);
    Task<FinancialRecord> GetFinancalRecordById(Guid Id, string userId);
    Task<FinancialRecord> UpdateFinancalRecord(Guid Id, FinancalRecordDto dto, string userId);
    Task<bool> DeleteFinancalRecord(Guid Id, string userId);
}
