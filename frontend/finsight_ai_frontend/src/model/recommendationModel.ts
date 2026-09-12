export interface IActionRecommendation {
    priority: string
    category: string
    action_title: string
    detailed_steps: string
    expected_outcome: string
}

export interface IRecommendation {
    id: string
    title: string,
    description: string
    createdAt: string
}