using System.Security.Claims;
using finsight_ai.DTO;
using finsight_ai.Exceptions;
using finsight_ai.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace finsight_ai.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessDecisionController : ControllerBase
    {
        private readonly IBusinessDecision _service;

        public BusinessDecisionController(IBusinessDecision service)
        {
            _service = service;
        }

        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value ??
        throw new BadRequestException("Missing user ID");


        [HttpPost]
        public async Task<IActionResult> CreateBusinessDecision([FromBody] BusinessDecisionDto dto)
        {
            var result = await _service.CreateBusinessDecision(dto, UserId);

            return CreatedAtAction(nameof(GetBusinessDecisionById), new { id = result.Id }, result);
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetBusinessDecisionById(Guid Id)
        {
            var result = await _service.GetDecisionById(Id, UserId);

            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllBusinessDecision()
        {
            var result = await _service.GetAllDecisions(UserId);

            return Ok(result);
        }


        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteBusinessDecisionById(Guid Id)
        {
            await _service.DeleteBusinessDecision(Id, UserId);

            return NoContent();
        }


        [HttpPatch("{Id}")]
        public async Task<IActionResult> UpdateBusinessDecisionById([FromBody] BusinessDecisionDto dto, Guid Id)
        {
            var result = await _service.UpdateBusinessDecision(Id, dto, UserId);

            return Ok(result);
        }

    }
}
