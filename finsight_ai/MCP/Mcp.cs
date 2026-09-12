using System;
using Microsoft.SemanticKernel;
using ModelContextProtocol.Client;

namespace finsight_ai.MCP;

public class Mcp
{
    private readonly string _braveSearchApiKey;
    private readonly string _tavilyApiKey;
    public Mcp(IConfiguration configuration)
    {
        _braveSearchApiKey = configuration["BraveSearch:ApiKey"] ?? throw new Exception("Brave Search API key is not configured.");
        _tavilyApiKey = configuration["Tavily:ApiKey"] ?? throw new Exception("Tavily API key is not configured.");
    }
    // public async Task AddBraveSearch(IKernelBuilder kernelBuilder)
    // {
    //     var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
    //     {
    //         Name = "BraveSearch",
    //         Command = "npx",
    //         Arguments = ["-y",
    //     "@brave/brave-search-mcp-server"],
    //         EnvironmentVariables = new Dictionary<string, string?>
    //         {
    //             // ["BRAVE_SEARCH_API_KEY"] = _braveSearchApiKey
    //         }
    //     }));
    //     var tools = await mcpClient.ListToolsAsync();
    //     kernelBuilder.Plugins.AddFromFunctions("BSearch", tools.Select(skFunction => skFunction.AsKernelFunction()));
    // }

    public async Task AddTavily(IKernelBuilder kernelBuilder)
    {
        var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
        {
            Name = "Tavily",
            Command = "npx",
            Arguments = ["-y",
            "mcp-remote",
            $"https://mcp.tavily.com/mcp/?tavilyApiKey={_tavilyApiKey}"],
            EnvironmentVariables = new Dictionary<string, string?>
            {
                ["TAVILY_API_KEY"] = _tavilyApiKey
            }
        }));
        var tools = await mcpClient.ListToolsAsync();
        kernelBuilder.Plugins.AddFromFunctions("Tavily", tools.Select(skFunction => skFunction.AsKernelFunction()));
        Console.WriteLine("✅ Tavily MCP loaded and Ready!");

    }


    // public async Task AddDuckDuckGo(IKernelBuilder kernelBuilder)
    // {
    //     var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
    //     {
    //         Name = "DuckDuckGo",
    //         Command = "npx",
    //         Arguments = ["-y", "duckduckgo-mcp-server"]
    //     }));

    //     var tools = await mcpClient.ListToolsAsync();
    //     kernelBuilder.Plugins.AddFromFunctions("DuckDuckGo", tools.Select(skFunction => skFunction.AsKernelFunction()));
    // }

    // public async Task AddCanva(IKernelBuilder kernelBuilder)
    // {
    //     var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
    //     {
    //         Name = "Canva",
    //         Command = "npx",
    //         Arguments = ["-y", "mcp-remote@latest", "https://mcp.canva.com/mcp"]
    //     }));

    //     var tools = await mcpClient.ListToolsAsync();
    //     kernelBuilder.Plugins.AddFromFunctions("Canva", tools.Select(skFunction => skFunction.AsKernelFunction()));
    // }

    // public async Task AddChartJs(IKernelBuilder kernelBuilder)
    // {
    //     var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
    //     {
    //         Name = "ChartJS",
    //         Command = "npx",
    //         Arguments = ["-y", "@ax-crew/chartjs-mcp-server"]
    //     }));

    //     var tools = await mcpClient.ListToolsAsync();
    //     kernelBuilder.Plugins.AddFromFunctions("Charts", tools.Select(t => t.AsKernelFunction()));
    // }

    // public async Task AddMermaid(IKernelBuilder kernelBuilder)
    // {
    //     var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
    //     {
    //         Name = "Mermaid",
    //         Command = "npx",
    //         Arguments = ["-y", "@narasimhaponnada/mermaid-mcp-server"]
    //     }));

    //     var tools = await mcpClient.ListToolsAsync();
    //     kernelBuilder.Plugins.AddFromFunctions("Diagrams", tools.Select(t => t.AsKernelFunction()));
    // }

    // public async Task AddInfographics(IKernelBuilder kernelBuilder)
    // {
    //     var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
    //     {
    //         Name = "QuickChart",
    //         Command = "npx",
    //         Arguments = ["-y", "@gongrzhe/quickchart-mcp-server"]
    //     }));

    //     var tools = await mcpClient.ListToolsAsync();

    //     kernelBuilder.Plugins.AddFromFunctions("Infographics", tools.Select(t => t.AsKernelFunction()));

    //     Console.WriteLine("✅ QuickChart MCP loaded och ready!");
    // }

    public async Task AddCalculator(IKernelBuilder kernelBuilder)
    {
        var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
        {
            Name = "Calculator",
            Command = "npx",
            Arguments = ["-y", "@wrtnlabs/calculator-mcp@latest"]
        }));

        var tools = await mcpClient.ListToolsAsync();
        kernelBuilder.Plugins.AddFromFunctions("Math", tools.Select(t => t.AsKernelFunction()));

        Console.WriteLine("✅ Calculator MCP loaded and Ready!");
    }

    public async Task AddPuppeteer(IKernelBuilder kernelBuilder)
    {
        var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
        {
            Name = "Puppeteer",
            Command = "npx",
            Arguments = ["-y", "@modelcontextprotocol/server-puppeteer"]
        }));

        var tools = await mcpClient.ListToolsAsync();
        kernelBuilder.Plugins.AddFromFunctions("Browser", tools.Select(t => t.AsKernelFunction()));
        Console.WriteLine("✅ Puppeteer (Web Scraper) MCP Ready!");
    }


    // public async Task AddFetch(IKernelBuilder kernelBuilder)
    // {
    //     var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
    //     {
    //         Name = "Fetch",
    //         Command = "npx",
    //         Arguments = ["-y", "@modelcontextprotocol/server-fetch"]
    //     }));

    //     var tools = await mcpClient.ListToolsAsync();
    //     kernelBuilder.Plugins.AddFromFunctions("WebReader", tools.Select(t => t.AsKernelFunction()));
    //     Console.WriteLine("✅ Fetch (Fast Web Reader) MCP Ready!");
    // }

    public async Task AddPostgres(IKernelBuilder kernelBuilder, string connectionString)
    {
        if (string.IsNullOrEmpty(connectionString))
            throw new Exception("Database connection string is missing.");

        var mcpClient = await McpClient.CreateAsync(new StdioClientTransport(new()
        {
            Name = "Postgres",
            Command = "npx",
            Arguments = ["-y", "@modelcontextprotocol/server-postgres", connectionString]
        }));

        var tools = await mcpClient.ListToolsAsync();
        kernelBuilder.Plugins.AddFromFunctions("Database", tools.Select(t => t.AsKernelFunction()));
        Console.WriteLine("✅ Postgres (Database AI) MCP Ready!");
    }
}
