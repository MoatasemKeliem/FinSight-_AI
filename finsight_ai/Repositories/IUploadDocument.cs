using System;
using finsight_ai.Entities;

namespace finsight_ai.Repositories;

public interface IUploadDocument
{
    public Task<List<UploadedDocument>> GetAllDocuments(string userId);
    public Task<UploadedDocument> GetDocumentById(string userId, string id);
    public Task<bool> DeleteDocumentById(string userId, string id);
}
