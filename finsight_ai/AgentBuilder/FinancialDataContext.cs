using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.AgentBuilder;

public class FinancialDataContext
{

    private readonly ApplicationDbContext _context;

    public FinancialDataContext(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<string> BuildDataContext(string userId)
    {
        var financial = await _context.FinancialRecords
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Date).Take(10)
            .ToListAsync();

        var cashFlow = await _context.CashFlowSnapshots
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Date).Take(10)
            .ToListAsync();

        var decisions = await _context.BusinessDecisions
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Date).Take(10)
            .ToListAsync();
        var documents = await _context.UploadedDocuments
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.UploadedAt).Take(5).Select(d => new { d.FileName, d.ExtractedText })
            .ToListAsync();

        var options = new JsonSerializerOptions
        {
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            WriteIndented = true
        };

        return JsonSerializer.Serialize(new
        {
            financial,
            cashFlow,
            decisions,
            documents
        }, options);
    }
}
