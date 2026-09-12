using finsight_ai.DTO;
using finsight_ai.Repositories;
using finsight_ai.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace finsight_ai.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _service.Register(model);

            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok("User registered successfully");

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var token = await _service.Login(model);

            if (token == null) return Unauthorized("Invalid login credentials");

            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Secure = true,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            return Ok("User Logged in successfully");
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok("User Logged out successfully");
        }

        [Authorize]
        [HttpGet("check")]
        public IActionResult CheckAuth() => Ok(new { isAuthenticated = true });

    }
}
