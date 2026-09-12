import { useEffect, useState } from 'react'
import type { IBusinessDecision } from '../model/businessDecision'
import { GetAllBusinessDecisions, DeleteBusinessDecisionNyId } from '../api/businessDecision'
import { DollarSign, TrendingUp, Calendar, ChevronRight, Briefcase, Trash2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface IDecisionProps {
    numberOfDecisions?: number
    short?: boolean
}

const BusinessDecisionComponent = ({ numberOfDecisions, short = false }: IDecisionProps) => {
    const [decisions, setDecisions] = useState<IBusinessDecision[] | null>([])
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const getData = async () => {
        const response = await GetAllBusinessDecisions()
        setDecisions(response)
    }

    useEffect(() => {
        getData()
    }, [])

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this decision?")) return
        setIsDeleting(id)
        try {
            await DeleteBusinessDecisionNyId(id)
            await getData()
        } catch (error) {
            console.error("Delete Error:", error)
            alert("Failed to delete decision.")
        } finally {
            setIsDeleting(null)
        }
    }

    const displayedDecisions = (decisions || []).slice(0, typeof numberOfDecisions === "number" ? numberOfDecisions : (decisions || []).length)

    const getRiskColor = (risk: any) => {
        const riskStr = Array.isArray(risk) ? risk[0] : (risk || 'Unknown');
        switch (String(riskStr).toLowerCase()) {
            case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'
            case 'medium': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
            default: return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'
        }
    }

    return (
        <div className="space-y-4">
            {displayedDecisions.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all">
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-slate-50">{item.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar size={12} className="text-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getRiskColor(item.riskLevel)}`}>
                                    {item.riskLevel} Risk
                                </span>
                                <button 
                                    onClick={() => item.id && handleDelete(item.id)}
                                    disabled={!!isDeleting}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                >
                                    {isDeleting === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                </button>
                            </div>
                        </div>

                        {!short && (
                            <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                                {item.description}
                            </p>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-1">Estimated Cost</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-1">
                                    <DollarSign size={14} className="text-red-500" /> {item.estimatedCost}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20">
                                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase mb-1">Expected Return</p>
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                    <TrendingUp size={14} /> {item.expectedReturn}
                                </p>
                            </div>
                        </div>
                    </div>

                    {short && (
                        <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20 flex justify-end">
                            <Link to="/companyprofile" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                View Details <ChevronRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default BusinessDecisionComponent
