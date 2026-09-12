import type { IFinancialRecord } from "../model/FinancialRecordModel";


export const revenueType = (
    category: IFinancialRecord["Category"]
): string => {
    return category.replace(/([a-z])([A-Z])/g, "$1 $2");
};
