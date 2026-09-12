import { useEffect, useState } from "react"
import type { IFinancial } from "../model/IFinancialRecord"
import { GetAllFinancialRecords } from "../api/finincialRecord"
import { Banknote, TrendingUp, TrendingDown, Calendar, Database, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { revenueType } from "../lib/extraFunctions"
import type { IFinancialRecord } from "../model/FinancialRecordModel"

interface IFinancialProps {
    numberOfRecords: number
    short?: boolean
}

const FinancialRecords = ({ numberOfRecords, short = false }: IFinancialProps) => {
    const [records, setRecords] = useState<IFinancial[]>([])

    useEffect(() => {
        const getData = async () => {
            const response = await GetAllFinancialRecords()
            setRecords(response);
        }

        getData()
    }, [])

    const displayRecords = typeof numberOfRecords === "number"
        ? records.slice(0, numberOfRecords)
        : records

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <Banknote size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-50">
                        {short ? "Recent Transactions" : "Financial Records"}
                    </h3>
                </div>
                {!short && (
                    <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
                        Export CSV
                    </button>
                )}
            </div>

            {/* Records List */}
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {displayRecords.length > 0 ? (
                    displayRecords.map((item) => {
                        const isExpense = item.recordType.toLowerCase().includes('expense') || item.amount < 0;

                        return (
                            <Link
                                key={item.id}
                                to={`/single_Financial/${item.id}`}
                                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer block"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${isExpense
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                                            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'
                                            }`}>
                                            {isExpense ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                                {revenueType(item.category as IFinancialRecord["Category"])}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                                                    <Calendar size={12} />
                                                    {item.date.slice(0, 10)}
                                                </span>
                                                {!short && (
                                                    <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                                                        <Database size={12} />
                                                        {item.source}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right flex items-center gap-3">
                                        <div className="space-y-1">
                                            <p className={`text-sm font-bold ${isExpense ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                                                }`}>
                                                {isExpense ? '-' : '+'}{formatCurrency(Math.abs(item.amount))}
                                            </p>
                                            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-tighter">
                                                {item.recordType}
                                            </p>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 dark:text-slate-700 group-hover:text-gray-400 dark:group-hover:text-slate-500" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="px-6 py-12 text-center">
                        <Banknote size={40} className="mx-auto text-gray-200 dark:text-slate-800 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-slate-400">No financial records found.</p>
                    </div>
                )}
            </div>

            {short && (
                <div className="px-6 py-3 bg-gray-50/30 dark:bg-slate-800/20 border-t border-gray-100 dark:border-slate-800">
                    <Link to="/documents" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                        View all transactions <ChevronRight size={14} />
                    </Link>
                </div>
            )}
        </div>
    )
}

export default FinancialRecords
