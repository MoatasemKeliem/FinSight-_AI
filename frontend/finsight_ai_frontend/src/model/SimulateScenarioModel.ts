export interface IFinancialImpact {
    baseline_monthly_net: string
    projected_monthly_net: string
    runway_impact: string
}

export interface IChartData {
    x_axis_label: string
    y_axis_label: string
    labels: string[]
    data: number[]
}

export interface ISimulateScenario {
    id: string
    title: string
    scenarioSummary: string
    financialImpactJson: string
    chartUrl?: string
    chartData?: any
    qualitativeAnalysis: string
    finalVerdict: string
    createdAt: string
}