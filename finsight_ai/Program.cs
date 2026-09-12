using System.Text;
using System.Text.Json.Serialization;
using finsight_ai;
using finsight_ai.AgentBuilder;
using finsight_ai.Repositories;
using finsight_ai.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.SemanticKernel;
#pragma warning disable SKEXP0010
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
})
.AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    }); ;// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseNpgsql(connectionString)
);

var kernelBuilder = builder.Services.AddKernel();

var modelId = builder.Configuration["OpenAI:ModelId"] ?? throw new Exception("Model ID is missing");
var OpenAI_Key = builder.Configuration["OpenAI:Key"] ?? throw new Exception("OpenAI Key is missing");
var embeddingModel = builder.Configuration["OpenAI:EmbeddingModel"] ?? throw new Exception("Embedding Model ID is missing");

builder.Services.AddSingleton<IFunctionInvocationFilter, finsight_ai.MCP.McpLoggingFilter>();

// kernelBuilder.Services.AddOpenAIChatCompletion(
//     modelId,
//     OpenAI_Key
// );

// kernelBuilder.AddOpenAIEmbeddingGenerator(
//     modelId: embeddingModel,
//     apiKey: OpenAI_Key
// );

var handler = new HttpClientHandler();
handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) =>
{
    if (builder.Environment.IsDevelopment())
    {
        return true;
    }
    return errors == System.Net.Security.SslPolicyErrors.None;
};

var httpClient = new HttpClient(handler);

kernelBuilder.AddOpenAIChatCompletion(
    modelId: modelId,
    apiKey: OpenAI_Key,
    httpClient: httpClient
);

kernelBuilder.AddOpenAIEmbeddingGenerator(
    modelId: embeddingModel,
    apiKey: OpenAI_Key
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICompanyProfile, CompanyProfileService>();
builder.Services.AddScoped<IFinancialRecord, FinancialRecordService>();
builder.Services.AddScoped<IBusinessDecision, BusinessDecisionService>();
builder.Services.AddScoped<IAIAnalysis, AIInsightService>();
builder.Services.AddScoped<IAiService, AIService>();
builder.Services.AddScoped<IPredictService, PredictService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();
builder.Services.AddScoped<ISimulateScenario, SimulateScenario>();
builder.Services.AddScoped<FileExtractionService>();
builder.Services.AddScoped<ReportService>();
builder.Services.AddScoped<AnalyzeRiskAI>();
builder.Services.AddScoped<FinancialDataContext>();
builder.Services.AddScoped<IRiskAnalysis, RiskAnalysisService>();
builder.Services.AddScoped<PredictAI>();
builder.Services.AddScoped<RecommendationsAI>();
builder.Services.AddScoped<ScenarioAI>();
builder.Services.AddScoped<IUploadDocument, UploadedDocumentService>();

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 7;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;

    options.Lockout.AllowedForNewUsers = true;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;

    options.User.RequireUniqueEmail = true;
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies["jwt"];
            return Task.CompletedTask;
        }
    };
});

var mcp = new finsight_ai.MCP.Mcp(builder.Configuration);

await mcp.AddTavily(kernelBuilder);
// await mcp.AddDuckDuckGo(kernelBuilder);
// await mcp.AddChartJs(kernelBuilder);
// await mcp.AddInfographics(kernelBuilder);
await mcp.AddPuppeteer(kernelBuilder);
// await mcp.AddFetch(kernelBuilder);
var mcpDbUrl = builder.Configuration["McpPostgresUrl"] ?? throw new Exception("MCP Database URL is missing in appsettings");
await mcp.AddPostgres(kernelBuilder, mcpDbUrl);
await mcp.AddCalculator(kernelBuilder);

var app = builder.Build();
app.UseCors("AllowFrontend");
app.UseAuthentication();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var roles = new[] { "Admin", "User" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
