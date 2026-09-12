import { useState } from 'react'
import type { ICreateBusinessDecision, ICreateFinancialRecord } from '../model/InsertInsightModel'
import { CreateFinancialRecord } from '../api/finincialRecord'
import { CreateBusinessDecision } from '../api/businessDecision'
import { Banknote, Briefcase, Plus, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react'

interface InsertInsightProps {
    onClose?: () => void;
    onSuccess?: () => void;
}

const InsertInsight = ({ onClose, onSuccess }: InsertInsightProps) => {
    const [activeTab, setActiveTab] = useState<'financial' | 'decision'>('financial')
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<{ message: string, success: boolean } | null>(null)

    const [financialRecord, setAddFinancialRecord] = useState<ICreateFinancialRecord>({
        recordType: "Income",
        amount: 0,
        category: "SubscriptionRevenue",
        source: "Manual"
    })

    const [businessDecision, setAddBusinessDecision] = useState<ICreateBusinessDecision>({
        title: "",
        description: "",
        estimatedCost: 0,
        expectedReturn: 0,
        riskLevel: "Medium"
    })

    const handleFinancialSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setStatus(null)
        try {
            // Note: API signature currently uses IBusinessDecision but we pass ICreateFinancialRecord
            // We cast to any to bypass the user's current type mismatch in the API file
            await CreateFinancialRecord(financialRecord as any)
            setStatus({ message: "Financial record created!", success: true })
            onSuccess?.()
            setTimeout(() => setStatus(null), 3000)
        } catch (error) {
            setStatus({ message: "Failed to create record.", success: false })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDecisionSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setStatus(null)
        try {
            await CreateBusinessDecision(businessDecision as any)
            setStatus({ message: "Business decision saved!", success: true })
            onSuccess?.()
            setTimeout(() => setStatus(null), 3000)
        } catch (error) {
            setStatus({ message: "Failed to save decision.", success: false })
        } finally {
            setIsLoading(false)
        }
    }

    const categories = [
        "ProductSales", "ServiceIncome", "ConsultingIncome", "SubscriptionRevenue", "OtherRevenue",
        "Salaries", "EmployerContributions", "Rent", "Utilities", "OfficeSupplies", "Software",
        "Marketing", "Insurance", "Accounting", "Legal", "Taxes", "Depreciation", "Travel",
        "Equipment", "OtherExpense"
    ]

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl">
                        <Plus size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Insert Manual Insight</h2>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 dark:bg-slate-800 m-6 rounded-xl">
                <button 
                    onClick={() => setActiveTab('financial')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                        activeTab === 'financial' 
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'
                    }`}
                >
                    <Banknote size={16} />
                    Financial Record
                </button>
                <button 
                    onClick={() => setActiveTab('decision')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                        activeTab === 'decision' 
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'
                    }`}
                >
                    <Briefcase size={16} />
                    Business Decision
                </button>
            </div>

            <div className="p-6 pt-0">
                {status && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 ${
                        status.success ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'
                    }`}>
                        {status.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <p className="text-sm font-bold">{status.message}</p>
                    </div>
                )}

                {activeTab === 'financial' ? (
                    <form onSubmit={handleFinancialSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Type</label>
                                <select 
                                    value={financialRecord.recordType}
                                    onChange={(e) => setAddFinancialRecord({...financialRecord, recordType: e.target.value as any})}
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Amount</label>
                                <input 
                                    type="number"
                                    value={financialRecord.amount}
                                    onChange={(e) => setAddFinancialRecord({...financialRecord, amount: parseFloat(e.target.value)})}
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                            <select 
                                value={financialRecord.category}
                                onChange={(e) => setAddFinancialRecord({...financialRecord, category: e.target.value as any})}
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                            {isLoading ? "Saving..." : "Add Record"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleDecisionSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Decision Title</label>
                            <input 
                                type="text"
                                value={businessDecision.title}
                                onChange={(e) => setAddBusinessDecision({...businessDecision, title: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                placeholder="e.g. Expand to European Market"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea 
                                value={businessDecision.description}
                                onChange={(e) => setAddBusinessDecision({...businessDecision, description: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-[100px]"
                                placeholder="Describe the strategic context..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Cost</label>
                                <input 
                                    type="number"
                                    value={businessDecision.estimatedCost}
                                    onChange={(e) => setAddBusinessDecision({...businessDecision, estimatedCost: parseFloat(e.target.value)})}
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Return</label>
                                <input 
                                    type="number"
                                    value={businessDecision.expectedReturn}
                                    onChange={(e) => setAddBusinessDecision({...businessDecision, expectedReturn: parseFloat(e.target.value)})}
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Risk Level</label>
                            <select 
                                value={businessDecision.riskLevel}
                                onChange={(e) => setAddBusinessDecision({...businessDecision, riskLevel: e.target.value as any})}
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                            {isLoading ? "Saving..." : "Save Decision"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default InsertInsight
