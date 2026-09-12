using System;
using finsight_ai.DTO;
using finsight_ai.DTO.ResponseDTO;
using finsight_ai.Entities;
using finsight_ai.Repositories;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.Service;

public class FinancialRecordService : IFinancialRecord
{
    private readonly ApplicationDbContext _context;

    public FinancialRecordService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<FinancialRecordResponseDto> CreateFinancalRecord(FinancalRecordDto dto, string userId)
    {
        var CompanyProfileExist = await _context.CompanyProfiles.FirstOrDefaultAsync(c => c.UserId == userId) ?? throw new Exception("");

        var Record = new FinancialRecord
        {
            RecordType = dto.RecordType,
            Amount = dto.Amount,
            Category = dto.Category,
            Source = dto.Source,
            UserId = userId,
            CompanyProfileId = CompanyProfileExist.Id,
            Date = DateTime.UtcNow

        };

        await _context.FinancialRecords.AddAsync(Record);
        await _context.SaveChangesAsync();

        return new FinancialRecordResponseDto
        {
            Id = Record.Id,
            Amount = Record.Amount,
            Category = Record.Category
        };
    }

    public async Task<bool> DeleteFinancalRecord(Guid Id, string userId)
    {
        if (Guid.Empty == Id) throw new KeyNotFoundException("ID is missing");

        var FinancalRecordToDelete = await _context.FinancialRecords
        .Where(fr => fr.Id == Id && fr.UserId == userId)
        .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Couldn't find Financial Record");

        _context.FinancialRecords.Remove(FinancalRecordToDelete);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<FinancialRecord>> GetAllFinancalRecords(string userId)
    {
        var AllFinancialRecords = await _context.FinancialRecords
        .Where(fr => fr.UserId == userId)
        .ToListAsync();

        return AllFinancialRecords;
    }

    public async Task<FinancialRecord> GetFinancalRecordById(Guid Id, string userId)
    {
        if (Guid.Empty == Id) throw new KeyNotFoundException("ID is missing");

        var FinancialRecord = await _context.FinancialRecords
        .Where(fr => fr.Id == Id && fr.UserId == userId)
        .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Couldn't find Financial Record");

        return FinancialRecord;
    }

    public async Task<FinancialRecord> UpdateFinancalRecord(Guid Id, FinancalRecordDto dto, string userId)
    {
        if (Guid.Empty == Id) throw new KeyNotFoundException("ID is missing");

        var FinancialRecordToUpdate = await _context.FinancialRecords
        .Where(fr => fr.Id == Id && fr.UserId == userId)
        .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Couldn't find Financial Record");

        FinancialRecordToUpdate.RecordType = dto.RecordType;
        FinancialRecordToUpdate.Amount = dto.Amount;
        FinancialRecordToUpdate.Category = dto.Category;
        FinancialRecordToUpdate.Source = dto.Source;

        await _context.SaveChangesAsync();
        return FinancialRecordToUpdate;
    }
}
