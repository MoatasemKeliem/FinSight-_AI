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
    public class PredictionController : ControllerBase
    {

        private readonly IPredictService _service;

        public PredictionController(IPredictService service)
        {
            _service = service;
        }

        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value
   ?? throw new UnauthorizedAccessException("User ID is missing");

        [HttpGet]
        public async Task<IActionResult> GetAllPredictions()
        {
            var result = await _service.GetAllPredictions(UserId);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPredictionById(string id)
        {
            var result = await _service.GetPredictionById(UserId, id);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePredictionById(string id)
        {
            var result = await _service.DeletePrediction(UserId, id);

            return Ok(result);
        }
    }
}
