export interface IFinancialRecord {
    RecordType: ["Income", "Expense"];
    Amount: number,
    Category:
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

    Source: ["Manual", "API", "Upload"];
}


