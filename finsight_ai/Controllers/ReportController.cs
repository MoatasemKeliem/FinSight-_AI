using System.Security.Claims;
using finsight_ai.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace finsight_ai.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly ReportService _reportService;

        public ReportController(ReportService reportService)
        {
            _reportService = reportService;
        }

        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value ?? throw new UnauthorizedAccessException("User Not Authorized");

        [HttpGet("download-summary")]
        public async Task<IActionResult> DownloadSummaryPdf()
        {
            try
            {
                byte[] pdfBytes = await _reportService.GenerateExecutiveSummaryPdf(UserId);
                string fileName = $"Finsight_Executive_Summary_{DateTime.UtcNow:yyyyMMdd}.pdf";

                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to generate PDF: {ex.Message}");
            }
        }
    }
}