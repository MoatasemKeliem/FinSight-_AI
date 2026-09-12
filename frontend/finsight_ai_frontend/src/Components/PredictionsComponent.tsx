import { useEffect, useState } from "react"
import type { IPredictions } from "../model/predictionsModel"
import { GetAllPredictions } from "../api/predictions"
import { Sparkles, Calendar, Target, Zap, ChevronRight, BarChart3, MessageSquareText } from "lucide-react"
import { Link } from "react-router-dom"

interface IPredictionProps {
    numberOfPredictions?: number
    short?: boolean
}

const PredictionsComponent = ({ numberOfPredictions, short = false }: IPredictionProps) => {
    const [preictions, setPredictions] = useState<IPredictions[]>([])

    useEffect(() => {
        const getData = async () => {
            const response = await GetAllPredictions();
            setPredictions(response)
        }

        getData()
    }, [])

    const displayPredictions = typeof numberOfPredictions === "number"
        ? preictions.slice(0, numberOfPredictions)
        : preictions;

    const getImpactStyles = (level: string) => {
        switch (level.toLowerCase()) {
            case 'high':
                return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
            case 'medium':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
            default:
                return 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700'
        }
    }

    return (
        <div className="space-y-8">
            {displayPredictions.length > 0 ? (
                displayPredictions.map((item) => {
                    const description: string[] = JSON.parse(item.description)
                    let predictionsData = []

                    try {
                        const parsed = JSON.parse(item.predictionsJson)
                        if (Array.isArray(parsed)) {
                            predictionsData = parsed
                        }
                    } catch (e) {
                        predictionsData = []
                    }

                    return (
                        <Link key={item.id} to={`/single_prediction/${item.id}`} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200 block hover:border-indigo-500">
                            {/* Card Header */}
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-slate-50">{item.title}</h3>
                                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">AI Generated Forecast</p>
                                    </div>
                                </div>
                                <BarChart3 size={18} className="text-gray-400" />
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Description Section */}
                                {!short && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <MessageSquareText size={14} /> Executive Summary
                                        </h4>
                                        <div className="space-y-3">
                                            {description.map((text, i) => (
                                                <p key={i} className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                                                    {text}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Predictions Grid */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Target size={14} /> Key Predictions
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {predictionsData.map((p, i) => (
                                            <div 
                                                key={i} 
                                                className="p-5 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/20 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-200 group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                                        <Zap size={16} fill="currentColor" />
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getImpactStyles(p.impact_level)}`}>
                                                        {p.impact_level} Impact
                                                    </span>
                                                </div>

                                                <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-2">{p.prediction_title}</h5>
                                                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-4">{p.details}</p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">
                                                        <Calendar size={12} />
                                                        {p.timeframe}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                                                        {p.category}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {short && (
                                <div className="px-6 py-3 bg-gray-50/30 dark:bg-slate-800/20 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                                    <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                        Analyze full predictions <ChevronRight size={14} />
                                    </div>
                                </div>
                            )}
                        </Link>
                    )
                })
            ) : (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                        <Sparkles size={32} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">No predictions generated yet</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs mx-auto">
                            Upload more financial documents to allow the AI to generate market forecasts.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PredictionsComponent
