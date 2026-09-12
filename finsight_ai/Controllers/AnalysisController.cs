using System.Security.Claims;
using finsight_ai.Exceptions;
using finsight_ai.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace finsight_ai.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalysisController : ControllerBase
    {
        private readonly IRiskAnalysis _service;

        public AnalysisController(IRiskAnalysis service)
        {
            _service = service;
        }

        private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value ??
         throw new BadRequestException("Wrong user");

        [HttpGet]
        public async Task<IActionResult> GetAllAnalysis()
        {
            var result = await _service.GetAllRiskAnalysis(UserId);

            return Ok(result);
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetAnalysisById(Guid Id)
        {
            var result = await _service.GetRiskAnalysById(Id, UserId);

            return Ok(result);
        }

        [HttpDelete("{Id}")]
        public async Task DeleteAnalysisById(Guid Id)
        {
            await _service.DeleteRiskAnalysById(Id, UserId);
        }
    }
}
