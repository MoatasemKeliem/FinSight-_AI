import { useEffect, useState } from 'react'
import { GetAllRecommendation, DeleteRecommendationById } from '../api/recommendation';
import type { IActionRecommendation, IRecommendation } from '../model/recommendationModel';
import { Lightbulb, ArrowUpRight, ListChecks, Target, Info, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IRecommendtionProps {
    numberOfRecommendation?: number;
    short?: boolean
}

const RecommendationsComponent = ({ numberOfRecommendation, short = false }: IRecommendtionProps) => {
    const [recommendations, setRecommendations] = useState<IRecommendation[]>([])
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const getData = async () => {
        const response = await GetAllRecommendation()
        setRecommendations(response)
    }

    useEffect(() => {
        getData()
    }, [])

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this recommendation?")) return
        setIsDeleting(id)
        try {
            await DeleteRecommendationById(id)
            await getData()
        } catch (error) {
            console.error("Delete Error:", error)
            alert("Failed to delete recommendation.")
        } finally {
            setIsDeleting(null)
        }
    }

    const displayRecommendation = typeof numberOfRecommendation === "number"
        ? recommendations.slice(0, numberOfRecommendation)
        : recommendations;

    const getPriorityStyles = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
            case 'medium':
                return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
            default:
                return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
        }
    }

    return (
        <div className="space-y-6">
            {displayRecommendation.map((item) => {
                const parsedDescription: IActionRecommendation[] = JSON.parse(item.description)

                return (
                    <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200">
                        {/* Card Header */}
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                                    <Lightbulb size={20} />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50">{item.title}</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <Info size={18} className="text-gray-400" />
                                <button 
                                    onClick={() => item.id && handleDelete(item.id)}
                                    disabled={!!isDeleting}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                >
                                    {isDeleting === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                {parsedDescription.map((recommendation, index) => (
                                    <div 
                                        key={index} 
                                        className="relative pl-6 border-l-2 border-indigo-100 dark:border-slate-800 space-y-4"
                                    >
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 shadow-sm"></div>
                                        
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h4 className="text-base font-bold text-gray-900 dark:text-slate-100">
                                                {recommendation.action_title}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityStyles(recommendation.priority)}`}>
                                                    {recommendation.priority} Priority
                                                </span>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                                                    {recommendation.category}
                                                </span>
                                            </div>
                                        </div>

                                        {!short && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 rounded-lg bg-gray-50/50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800/50">
                                                    <h5 className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                                                        <ListChecks size={14} /> Action Plan
                                                    </h5>
                                                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed italic">
                                                        "{recommendation.detailed_steps}"
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-lg bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20">
                                                    <h5 className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 uppercase flex items-center gap-1.5 mb-2">
                                                        <Target size={14} /> Expected Outcome
                                                    </h5>
                                                    <p className="text-sm text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed font-medium">
                                                        {recommendation.expected_outcome}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {short && (
                                            <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-1">
                                                {recommendation.expected_outcome}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {short && (
                            <div className="px-6 py-3 bg-gray-50/30 dark:bg-slate-800/20 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                                <Link to="/recommendations" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                    Full implementation guide <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default RecommendationsComponent
