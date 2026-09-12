using System;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;
using Microsoft.SemanticKernel.Agents.Chat;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;

#pragma warning disable SKEXP0110
namespace finsight_ai.AgentBuilder;

public class ScenarioAI
{
    private readonly Kernel _kernel;
    private readonly FinancialDataContext _dataBuilder;

    public ScenarioAI(Kernel kernel, FinancialDataContext dataContext)
    {
        _kernel = kernel;
        _dataBuilder = dataContext;
    }

    public async Task<string> SimulateScenarioAI(string userId, string scenario)
    {
        var data = await _dataBuilder.BuildDataContext(userId);

        var executionSettings = new OpenAIPromptExecutionSettings
        {
            ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions
        };

        var MathGeniusAgent = new ChatCompletionAgent
        {
            Name = "Math_Genius_Agent",
            Description = "Calculates the exact financial numbers of the scenario.",
            Instructions = Service.Prompts.SimulateScenarioPrompt.MathGeniusPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executionSettings),
        };

        var ImpactAnalystAgent = new ChatCompletionAgent
        {
            Name = "Impact_Analyst_Agent",
            Description = "",
            Instructions = Service.Prompts.SimulateScenarioPrompt.ImpactAnalystPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executionSettings),
        };

        var SynthesizerAgent = new ChatCompletionAgent
        {
            Name = "Synthesizer_Agent",
            Description = "",
            Instructions = Service.Prompts.SimulateScenarioPrompt.SynthesizerPrompt,
            Kernel = _kernel,
            Arguments = new KernelArguments(executionSettings),
        };
        AgentGroupChat chat = new(MathGeniusAgent, ImpactAnalystAgent, SynthesizerAgent)
        {
            ExecutionSettings = new AgentGroupChatSettings
            {
                SelectionStrategy = new SequentialSelectionStrategy
                {
                    InitialAgent = MathGeniusAgent
                },
                TerminationStrategy = new SynthesizerTerminationStrategy()
            }
        };


        chat.AddChatMessage(new ChatMessageContent(AuthorRole.User, Service.Prompts.SimulateScenarioPrompt.GetScenarioPrompt(data, scenario)));

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

    public class SynthesizerTerminationStrategy : TerminationStrategy
    {
        protected override Task<bool> ShouldAgentTerminateAsync(Agent agent, IReadOnlyList<ChatMessageContent> history, CancellationToken cancellationToken = default)
        {
            var lastMessage = history.LastOrDefault();

            if (lastMessage != null && lastMessage.AuthorName == "Synthesizer_Agent")
            {
                return Task.FromResult(true);
            }

            return Task.FromResult(history.Count >= 20);
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
