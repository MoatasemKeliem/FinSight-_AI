import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { GetFinancialRecordById, DeleteFinancialRecordById } from '../api/finincialRecord'
import type { IFinancial } from '../model/IFinancialRecord'
import { Calendar, Database, ArrowLeft, TrendingUp, TrendingDown, Tag, Trash2, Loader2 } from 'lucide-react'
import { revenueType } from '../lib/extraFunctions'
import type { IFinancialRecord } from '../model/FinancialRecordModel'

const SingleFinancialRecord = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [record, setRecord] = useState<IFinancial | null>(null)
    const [loading, setLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchRecord = async () => {
            if (id) {
                try {
                    const data = await GetFinancialRecordById(id)
                    setRecord(data)
                } catch (error) {
                    console.error("Error fetching record:", error)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchRecord()
    }, [id])

    const handleDelete = async () => {
        if (!id || !window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) return
        setIsDeleting(true)
        try {
            await DeleteFinancialRecordById(id)
            navigate("/documents")
        } catch (error) {
            console.error("Delete Error:", error)
            alert("Failed to delete record. Please try again.")
        } finally {
            setIsDeleting(false)
        }
    }

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
    if (!record) return <div className="text-center py-20"><p className="text-gray-500">Record not found.</p><Link to="/dashboard" className="text-indigo-600 hover:underline">Return to Dashboard</Link></div>

    const isExpense = record.recordType.toLowerCase().includes('expense') || record.amount < 0

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <Link to="/documents" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Financials
                </Link>
                <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold text-sm disabled:opacity-50"
                >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    {isDeleting ? "Deleting..." : "Delete Record"}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className={`h-32 bg-gradient-to-r ${isExpense ? 'from-red-500 to-rose-600' : 'from-emerald-500 to-teal-600'} relative`}>
                    <div className="absolute -bottom-8 left-8">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-4 border-white dark:border-slate-900 shadow-lg">
                            {isExpense ? <TrendingDown size={32} className="text-red-500" /> : <TrendingUp size={32} className="text-emerald-500" />}
                        </div>
                    </div>
                </div>

                <div className="pt-12 px-8 pb-8 space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">{record.category}</h1>
                            <p className="text-gray-500 dark:text-slate-400 mt-1 uppercase text-xs font-bold tracking-widest">{record.recordType}</p>
                        </div>
                        <div className="text-right">
                            <p className={`text-3xl font-black ${isExpense ? 'text-red-600' : 'text-emerald-600'}`}>
                                {isExpense ? '-' : '+'}${Math.abs(record.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">Transaction Amount</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100 dark:border-slate-800">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50">
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Date</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{record.date.slice(0, 10)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50">
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                                <Database size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Data Source</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{record.source}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20">
                        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                            <Tag size={16} /> Audit Trail
                        </h3>
                        <p className="text-sm text-indigo-800/70 dark:text-indigo-300/70 leading-relaxed">
                            This transaction was automatically ingested from {record.source} on {record.date.slice(0, 10)}. It has been categorized as {revenueType(record.category as IFinancialRecord["Category"])} by the neural analysis engine.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleFinancialRecord
