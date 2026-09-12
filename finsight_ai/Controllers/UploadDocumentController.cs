using System.Security.Claims;
using finsight_ai.Entities;
using finsight_ai.Repositories;
using finsight_ai.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace finsight_ai.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UploadDocumentController : ControllerBase
    {
        private readonly IUploadDocument _service;
        private readonly ApplicationDbContext _context;
        private readonly FileExtractionService _fileService;

        public UploadDocumentController(IUploadDocument service, ApplicationDbContext context, FileExtractionService fileService)
        {
            _service = service;
            _context = context;
            _fileService = fileService;
        }

        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value ?? throw new UnauthorizedAccessException("Noy Authorized");

        [HttpGet]
        public async Task<IActionResult> GetAllDocumments()
        {
            var result = await _service.GetAllDocuments(UserId);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDocummentById(string id)
        {
            var result = await _service.GetDocumentById(UserId, id);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocummentById(string id)
        {
            await _service.DeleteDocumentById(UserId, id);

            return Ok();
        }


        [HttpPost]
        public async Task<IActionResult> UploadDocument([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("No file uploaded");

            var company = await _context.CompanyProfiles
                .FirstOrDefaultAsync(x => x.UserId == UserId);

            if (company == null) return BadRequest("Please create a company profile first.");

            try
            {
                string extractedText = await _fileService.ExtractText(file, UserId);

                var documentRecord = new UploadedDocument
                {
                    UserId = UserId,
                    FileName = file.FileName,
                    FileExtension = Path.GetExtension(file.FileName),
                    ExtractedText = extractedText,
                    UploadedAt = DateTime.UtcNow,
                    CompanyProfileId = company.Id
                };

                _context.UploadedDocuments.Add(documentRecord);
                await _context.SaveChangesAsync();

                return Ok(new { message = "File has been saved" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

    }
}
