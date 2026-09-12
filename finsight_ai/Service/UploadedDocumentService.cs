using System;
using finsight_ai.Entities;
using finsight_ai.Repositories;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.Service;

public class UploadedDocumentService : IUploadDocument
{
    private readonly ApplicationDbContext _context;

    public UploadedDocumentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> DeleteDocumentById(string userId, string id)
    {
        var document = await _context.UploadedDocuments.
        FirstOrDefaultAsync(d => d.UserId == userId && d.Id == Guid.Parse(id)) ?? throw new KeyNotFoundException("Couldn't delete Docuement");

        _context.UploadedDocuments.Remove(document);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<UploadedDocument> GetDocumentById(string userId, string id)
    {
        var document = await _context.UploadedDocuments.
        FirstOrDefaultAsync(d => d.UserId == userId && d.Id == Guid.Parse(id)) ?? throw new KeyNotFoundException("Couldn't delete Docuement");

        return document;
    }

    public async Task<List<UploadedDocument>> GetAllDocuments(string userId)
    {
        var documents = await _context.UploadedDocuments.Where(d => d.UserId == userId).ToListAsync();

        return documents;
    }


}
