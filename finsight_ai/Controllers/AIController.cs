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
    public class AIController : ControllerBase
    {
        private readonly IAiService _service;

        public AIController(IAiService service)
        {
            _service = service;
        }

        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        ?? throw new UnauthorizedAccessException("User ID is missing");

        [HttpPost("chat")]
        public async Task<IActionResult> ChatAI([FromBody] ChatDto dto)
        {
            var result = await _service.ChatAsync(dto, UserId);

            return Ok(result);
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeAI()
        {
            var result = await _service.AnalyzeRiskAsync(UserId);

            return Ok(result);
        }

        [HttpPost("simulate")]
        public async Task<IActionResult> AnalyzeSimulateAI([FromBody] SimulateDto request)
        {
            var result = await _service.SimulateScenarioAsync(UserId, request.Scenario);

            return Ok(result);
        }

        [HttpPost("predict")]
        public async Task<IActionResult> AnalyzePredictAI([FromBody] PredictRequestDto request)
        {
            var result = await _service.PredictAsync(UserId, request.Type);

            return Ok(result);
        }

        [HttpPost("recommendation")]
        public async Task<IActionResult> AnalyzeRecommendationAI()
        {
            var result = await _service.RecommendationsAI(UserId);

            return Ok(result);
        }

    }
}
