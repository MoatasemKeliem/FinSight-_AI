export interface IBusinessDecision {
    id?: string,
    title: string,
    description: string,
    estimatedCost: number,
    expectedReturn: number,
    riskLevel: ["Low", "Medium", "High", "Unknown"]
    date?: number;
}