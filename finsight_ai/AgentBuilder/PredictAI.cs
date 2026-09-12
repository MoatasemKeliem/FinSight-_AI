using System;
using finsight_ai.Service.Prompts;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;
using Microsoft.SemanticKernel.Agents.Chat;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using Prompts = finsight_ai.Service.Prompts.PredictAIPrompt;



#pragma warning disable SKEXP0110
namespace finsight_ai.AgentBuilder;

public class PredictAI
{
    private readonly Kernel _kernel;
    private readonly FinancialDataContext _dataBuilder;


    public PredictAI(Kernel kernel, FinancialDataContext dataBuilder)
    {
        _kernel = kernel;
        _dataBuilder = dataBuilder;
    }

    public async Task<string> Predict(string userId)
    {
        var data = await _dataBuilder.BuildDataContext(userId);

        var executionSettings = new OpenAIPromptExecutionSettings
        {
            ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions
        };

        var BranchAgent = new ChatCompletionAgent
        {
            Name = "BranchAgent",
            Description = "Predicts the overarching trends and lifecycle of the company's industry.",
            Instructions = Prompts.BranchAgentPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executionSettings)
        };

        var MacroAgent = new ChatCompletionAgent
        {
            Name = "MacroAgent",
            Description = "Analyzes political, economic, social, technological, and legal factors.",
            Instructions = Prompts.MacroAgentPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executionSettings)
        };

        var CompetitorAgent = new ChatCompletionAgent
        {
            Name = "CompetitorAgent",
            Description = "Analyzes the competitive landscape and rival strategies.",
            Instructions = Prompts.CompetitorAgentPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executionSettings)
        };

        var CustomerAgent = new ChatCompletionAgent
        {
            Name = "CustomerAgent",
            Description = "Predicts shifts in customer behavior, needs, and demographics.",
            Instructions = Prompts.CustomerAgentPrompt,
            Kernel = _kernel
        };


        var FinancialAgent = new ChatCompletionAgent
        {
            Name = "FinancialAgent",
            Description = "Analyzes the company's internal financial health and resilience.",
            Instructions = Prompts.FinancialAgentPrompt,
            Kernel = _kernel
        };

        var SynthesizerAgent = new ChatCompletionAgent
        {
            Name = "ChiefStrategistAgent",
            Description = "Synthesizes inputs from all other agents into a final, cohesive prediction.",
            Instructions = Prompts.SynthesizerAgentPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executionSettings)
        };

        AgentGroupChat chat = new(BranchAgent, MacroAgent, CompetitorAgent, CustomerAgent, FinancialAgent, SynthesizerAgent)
        {
            ExecutionSettings = new AgentGroupChatSettings
            {
                SelectionStrategy = new SequentialSelectionStrategy
                {
                    InitialAgent = BranchAgent
                },
                TerminationStrategy = new LimitIterationTerminationStrategy(4)
            }
        };

        chat.AddChatMessage(new ChatMessageContent(Microsoft.SemanticKernel.ChatCompletion.AuthorRole.User, Prompts.AIPromptPredicton(data)));

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
