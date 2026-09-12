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
    public class SimulateScenarioController : ControllerBase
    {
        private readonly ISimulateScenario _service;

        public SimulateScenarioController(ISimulateScenario service)
        {
            _service = service;
        }

        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        ?? throw new UnauthorizedAccessException("User ID is missing");


        [HttpGet]
        public async Task<IActionResult> GetAllSimulateScenario()
        {
            var result = await _service.GetAllScenarios(UserId);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSimulateScenarioById(string id)
        {
            var result = await _service.GetScenarioById(UserId, id);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSimulateScenarioById(string id)
        {
            var result = await _service.DeleteScenario(UserId, id);

            return Ok(result);
        }

    }
}
