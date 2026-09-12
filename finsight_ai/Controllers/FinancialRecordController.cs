using System.Security.Claims;
using finsight_ai.DTO;
using finsight_ai.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace finsight_ai.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FinancialRecordController : ControllerBase
    {
        private readonly IFinancialRecord _service;

        public FinancialRecordController(IFinancialRecord service)
        {
            _service = service;
        }

        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value
         ?? throw new UnauthorizedAccessException("User ID is missing");

        [HttpGet]
        public async Task<IActionResult> GetAllFinancialRecords()
        {
            var result = await _service.GetAllFinancalRecords(UserId);

            return Ok(result);
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetFinancialRecordById(Guid Id)
        {
            var result = await _service.GetFinancalRecordById(Id, UserId);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateFinancialRecord([FromBody] FinancalRecordDto dto)
        {
            var result = await _service.CreateFinancalRecord(dto, UserId);

            return CreatedAtAction(nameof(GetFinancialRecordById), new { Id = result.Id }, result);
        }


        [HttpPatch("{Id}")]
        public async Task<IActionResult> UpdateFinancialRecord([FromBody] FinancalRecordDto dto, Guid Id)
        {
            var result = await _service.UpdateFinancalRecord(Id, dto, UserId);

            return Ok(result);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteFinancialRecord(Guid Id)
        {
            await _service.DeleteFinancalRecord(Id, UserId);

            return NoContent();
        }
    }
}
