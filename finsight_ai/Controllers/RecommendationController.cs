using System.Security.Claims;
using finsight_ai.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace finsight_ai.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationController : ControllerBase
    {
        private readonly IRecommendationService _service;

        public RecommendationController(IRecommendationService service)
        {
            _service = service;
        }

        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        ?? throw new UnauthorizedAccessException("User ID is missing");

        [HttpGet]
        public async Task<IActionResult> GetAllRecommendations()
        {
            var result = await _service.GetAllRecommendations(UserId);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecommendationById(string id)
        {
            var result = await _service.GetRecommendationById(UserId, id);

            return Ok(result);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecommendationoById(string id)
        {
            var result = await _service.DeleteRecommendation(UserId, id);

            return Ok(result);
        }
    }
}
