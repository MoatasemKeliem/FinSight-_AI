using System.Security.Claims;
using finsight_ai.DTO;
using finsight_ai.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace finsight_ai.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyProfileController : ControllerBase
    {
        private readonly ICompanyProfile _service;

        public CompanyProfileController(ICompanyProfile service)
        {
            _service = service;
        }

        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value ??
         throw new UnauthorizedAccessException("User ID not found");

        [HttpPost]
        public async Task<IActionResult> CreateCompanyProfile([FromBody] CompanyProfileDto dto)
        {
            var result = await _service.CreateCompanyProfile(dto, UserId);

            return CreatedAtAction(nameof(GetCompanyProfile), new { id = result.Id }, result);
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetCompanyProfile(Guid Id)
        {
            var result = await _service.GetCompanyProfile(Id, UserId);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanyProfileByUserId()
        {
            var result = await _service.GetCompanyProfileByUserId(UserId);

            return Ok(result);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteCompanyProfile(Guid Id)
        {
            await _service.DeleteCompanyProfile(Id, UserId);

            return NoContent();
        }


        [HttpPatch("{Id}")]
        public async Task<IActionResult> UpdateCompanyProfile([FromBody] CompanyProfileDto dto, Guid Id)
        {
            var result = await _service.UpdateCompanyProfile(Id, dto, UserId);

            return Ok(result);
        }
    }
}
