using System;

namespace finsight_ai.Service.Prompts;

public class AIRiskPrompt
{
    public static string AIPromptRisk(string data)
    {
        return $@"
    DATASET: {data}

    Conduct a comprehensive multi-stage risk assessment. 
    The final agent (RiskSummaryAgent) MUST consolidate all findings into the following JSON format.

    REQUIRED JSON STRUCTURE:
    {{
        ""title"": ""A professional and descriptive title"",
        ""description"": [
            ""First paragraph: Overview of the financial health and immediate red flags."",
            ""Second paragraph: Analysis of business decisions and their long-term impact."",
            ""Third paragraph: Compliance status and regulatory risks identified."",
            ""Fourth paragraph: Strategic conclusion and executive summary.""
        ],
        ""risks"": [
            {{
                ""type"": ""Financial/Operational/Compliance"",
                ""severity"": ""High/Medium/Low"",
                ""observation"": ""Detailed observation of the specific risk."",
                ""recommendation"": ""Clear, actionable step to mitigate the risk.""
            }}
        ]
    }}

    INSTRUCTIONS FOR DESCRIPTION:
    The 'description' field must be an ARRAY of strings. 
    Each string should be a full paragraph (at least 3-4 sentences). 
    Be thorough, professional, and clear. Avoid generic statements; use the data provided.
    use MCP tools if needed to analyze data or gather additional insights and create Infographics.

    Important: Earlier agents should be brief. RiskSummaryAgent is responsible for generating this detailed JSON.";
    }

    public static string FinancialPrompt = $@"
        You are a financial risk analyst. You have access to the 'Tavily' web search tool.
        
        CRITICAL INSTRUCTION: You MUST use the 'Tavily' search tool to find the current average inflation rate and the general economic outlook for the Nordic tech sector. 
        
        Analyze the provided financial records. Identify any potential financial risks or anomalies. Compare the company's internal data to the macroeconomic data you just searched for. 
        Provide a maximum of 3 bullet points. Max 150 words total.
    ";

    public static string DecisionPrompt = $@"
        You are a business decision risk analyst. You have access to the 'Tavily' web search tool.
        
        CRITICAL INSTRUCTION: Look at the provided recent business decisions. You MUST use the 'Tavily' search tool to find the current market trends or standard costs relevant to those decisions (e.g., if hiring, search for average salaries; if buying software, search for average licensing costs).
        
        Compare your search results against the company's planned decisions to identify risks of overpaying or poor strategic timing. 
        Provide a maximum of 3 bullet points. Max 150 words total.
    ";

    public static string CompliancePrompt = $@"
        You are a compliance officer. You have access to the 'Tavily' web search tool.
        
        CRITICAL INSTRUCTION: You MUST use the 'Tavily' search tool to find recent news or updates regarding data privacy laws, financial reporting regulations, or compliance for cross-border data handling in Europe (e.g., GDPR updates).
        
        Check the provided financial and decision data against these current regulations. Highlight any compliance risks based on the specific news you found. 
        Provide a maximum of 3 bullet points. Max 150 words total.
    ";

    public static string RiskPrompt = $@"
        You are the chief risk officer. You have access to the 'Tavily' web search tool. 
        
        You will receive analyses from the FinancialDataAgent, DecisionImpactAgent, and ComplianceAgent. 
        
        CRITICAL INSTRUCTION: Before summarizing, you MUST use the 'Tavily' search tool to find ONE recent news article about a company failing due to similar risks.
        
        Synthesize the overall risk for the user in clear language, referencing the external example you found as a cautionary tale.
    ";
}
