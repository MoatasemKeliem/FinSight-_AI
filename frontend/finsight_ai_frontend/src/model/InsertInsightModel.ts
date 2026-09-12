export interface ICreateBusinessDecision {
    title: string,
    description: string,
    estimatedCost: number,
    expectedReturn: number
    riskLevel: "Low" | "Medium" | "High" | "Unknown"
}

export interface ICreateFinancialRecord {
    recordType: "Income" | "Expense",
    amount: number,
    category:
    | "ProductSales"
    | "ServiceIncome"
    | "ConsultingIncome"
    | "SubscriptionRevenue"
    | "OtherRevenue"
    | "Salaries"
    | "EmployerContributions"
    | "Rent"
    | "Utilities"
    | "OfficeSupplies"
    | "Software"
    | "Marketing"
    | "Insurance"
    | "Accounting"
    | "Legal"
    | "Taxes"
    | "Depreciation"
    | "Travel"
    | "Equipment"
    | "OtherExpense";
    source: "Manual"
}