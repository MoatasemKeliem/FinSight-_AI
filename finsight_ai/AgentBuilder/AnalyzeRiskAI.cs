using System;
using finsight_ai.Service;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Agents.Chat;
using Prompts = finsight_ai.Service.Prompts.AIRiskPrompt;
using Microsoft.SemanticKernel.Connectors.OpenAI;

#pragma warning disable SKEXP0110
namespace finsight_ai.AgentBuilder;


public class AnalyzeRiskAI
{
    private readonly Kernel _kernel;
    private readonly FinancialDataContext _dataBuilder;

    public AnalyzeRiskAI(Kernel kernel, FinancialDataContext dataBuilder)
    {
        _kernel = kernel;
        _dataBuilder = dataBuilder;
    }

    public async Task<string> AnalyzeRisk(string userId)
    {
        var data = await _dataBuilder.BuildDataContext(userId);

        var executionSettings = new OpenAIPromptExecutionSettings
        {
            ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions
        };

        var FinancialRiskAgent = new ChatCompletionAgent
        {
            Name = "FinancialRiskAgent",
            Description = "Analyzes financial data to identify potential risks and vulnerabilities.",
            Instructions = Prompts.FinancialPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executionSettings)
        };

        var DecisionImpactAgent = new ChatCompletionAgent
        {
            Name = "DecisionImpactAgent",
            Instructions = Prompts.DecisionPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executionSettings)
        };

        var ComplianceAgent = new ChatCompletionAgent
        {
            Name = "ComplianceAgent",
            Instructions = Prompts.CompliancePrompt,
            Kernel = _kernel
        };

        var RiskSummaryAgent = new ChatCompletionAgent
        {
            Name = "RiskSummaryAgent",
            Instructions = Prompts.RiskPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executionSettings)
        };


        AgentGroupChat chat = new(FinancialRiskAgent, DecisionImpactAgent, ComplianceAgent, RiskSummaryAgent)
        {
            ExecutionSettings = new AgentGroupChatSettings
            {
                SelectionStrategy = new SequentialSelectionStrategy
                {
                    InitialAgent = FinancialRiskAgent
                },
                TerminationStrategy = new LimitIterationTerminationStrategy(4)
            }
        };


        chat.AddChatMessage(new ChatMessageContent(AuthorRole.User, Prompts.AIPromptRisk(data)));

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
