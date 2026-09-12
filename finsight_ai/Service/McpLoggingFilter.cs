using System;
using System.Threading.Tasks;
using Microsoft.SemanticKernel;

namespace finsight_ai.MCP;

public class McpLoggingFilter : IFunctionInvocationFilter
{
    public async Task OnFunctionInvocationAsync(FunctionInvocationContext context, Func<FunctionInvocationContext, Task> next)
    {
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine($"\n[🔍 AI Tracker] AI Calling MCP: {context.Function.PluginName} -> {context.Function.Name}");

        foreach (var arg in context.Arguments)
        {
            Console.WriteLine($"   - Params: {arg.Key} = {arg.Value}");
        }
        Console.ResetColor();

        await next(context);

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"[✅ AI Tracker] {context.Function.Name} MCP Successfull!\n");
        Console.ResetColor();
    }
}