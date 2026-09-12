using System;
using finsight_ai.DTO;
using Microsoft.AspNetCore.Identity;

namespace finsight_ai.Repositories;

public interface IAuthService
{
    Task<string> Login(LoginDto model);
    Task<IdentityResult> Register(RegisterDto model);
}
