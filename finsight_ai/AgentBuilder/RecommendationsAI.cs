using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;
using Microsoft.SemanticKernel.Agents.Chat;
using Microsoft.SemanticKernel.ChatCompletion;
using ModelContextProtocol.Protocol;
using Prompts = finsight_ai.Service.Prompts.RecommendationPrompt;
using Microsoft.SemanticKernel.Connectors.OpenAI;

#pragma warning disable SKEXP0110
namespace finsight_ai.AgentBuilder;

public class RecommendationsAI
{
    private readonly ApplicationDbContext _context;
    private readonly Kernel _kernel;


    public RecommendationsAI(Kernel kernel, FinancialDataContext dataBuilder, ApplicationDbContext context)
    {
        _kernel = kernel;
        _context = context;

    }

    public async Task<string> RecommendActivicty(string userId)
    {
        var Risks = await _context.RiskAnalyses.
        Where(u => u.UserId == userId).ToListAsync();
        var Predictions = await _context.PredictionAnalysis.
        Where(u => u.UserId == userId).ToListAsync();

        string riskJson = JsonSerializer.Serialize(Risks);
        string predictJson = JsonSerializer.Serialize(Predictions);

        string combinedData = $"RISKS:\n{riskJson}\n\nPREDICTIONS:\n{predictJson}";

        var executingSettings = new OpenAIPromptExecutionSettings
        {
            ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions
        };

        var FinancialExpertAgents = new ChatCompletionAgent
        {
            Name = "CFO_Agent",
            Description = "Analyzes financial risks and funding opportunities.",
            Instructions = Prompts.CFOPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executingSettings)
        };

        var OperationsMarketExpertAgent = new ChatCompletionAgent
        {
            Name = "COO_Agent",
            Description = "Analyzes operational shifts and market positioning.",
            Instructions = Prompts.COOPRompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executingSettings)

        };

        var LeadConsultantAgent = new ChatCompletionAgent
        {
            Name = "LeadConsultantAgent",
            Description = "Synthesizes the final action plan into JSON.",
            Instructions = "You are the Lead Consultant. Review the advice from the CFO and COO. Output ONLY the requested JSON format summarizing the action plan.",
            Kernel = _kernel,
            Arguments = new KernelArguments(executingSettings)
        };

        AgentGroupChat chat = new(FinancialExpertAgents, OperationsMarketExpertAgent)
        {
            ExecutionSettings = new AgentGroupChatSettings
            {
                SelectionStrategy = new SequentialSelectionStrategy
                {
                    InitialAgent = FinancialExpertAgents
                },
                TerminationStrategy = new LimitIterationTerminationStrategy(4)
            }
        };


        chat.AddChatMessage(new ChatMessageContent(AuthorRole.User, Prompts.RecommendationAIPrompt(combinedData)));

        string finalResult = "";
        await foreach (var message in chat.InvokeAsync())
        {
            Console.WriteLine($"\n--- {message.AuthorName} ---");
            Console.WriteLine(message.Content);
            finalResult = message.Content!;
        }

        Console.WriteLine(CleanJsonResponse(finalResult));

        return CleanJsonResponse(finalResult);
    }

    public class LimitIterationTerminationStrategy(int max) : TerminationStrategy
    {
        private int _count = 0;

        protected override Task<bool> ShouldAgentTerminateAsync(Agent agent, IReadOnlyList<ChatMessageContent> history,
         CancellationToken cancellationToken = default)
        {
            _count++;
            return Task.FromResult(_count >= max);
        }
    }

    private string CleanJsonResponse(string rawJson)
    {
        if (string.IsNullOrWhiteSpace(rawJson)) return "{}";

        var clean = rawJson.Trim();
        if (clean.StartsWith("```json")) clean = clean.Substring(7);
        if (clean.StartsWith("```")) clean = clean.Substring(3);
        if (clean.EndsWith("```")) clean = clean.Substring(0, clean.Length - 3);

        return clean.Trim();
    }
}
