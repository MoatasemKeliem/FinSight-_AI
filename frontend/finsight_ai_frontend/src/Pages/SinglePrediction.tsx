import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { GetPredictionById, DeletePredictionById } from '../api/predictions'
import type { IPredictions } from '../model/predictionsModel'
import { Sparkles, Calendar, ArrowLeft, Target, Zap, BarChart3, MessageSquareText, Trash2, Loader2 } from 'lucide-react'

const SinglePrediction = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [prediction, setPrediction] = useState<IPredictions | null>(null)
    const [loading, setLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchPrediction = async () => {
            if (id) {
                try {
                    const data = await GetPredictionById(id)
                    setPrediction(data)
                } catch (error) {
                    console.error("Error fetching prediction:", error)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchPrediction()
    }, [id])

    const handleDelete = async () => {
        if (!id || !window.confirm("Are you sure you want to delete this prediction?")) return
        setIsDeleting(true)
        try {
            await DeletePredictionById(id)
            navigate("/aiinsight")
        } catch (error) {
            console.error("Delete Error:", error)
            alert("Failed to delete prediction.")
        } finally {
            setIsDeleting(false)
        }
    }

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
    if (!prediction) return <div className="text-center py-20"><p className="text-gray-500">Prediction not found.</p><Link to="/aiinsight" className="text-indigo-600 hover:underline">Return to Insights</Link></div>

    const description: string[] = JSON.parse(prediction.description)
    let predictionsData: any[] = []
    try {
        const parsed = JSON.parse(prediction.predictionsJson)
        if (Array.isArray(parsed)) predictionsData = parsed
    } catch (e) {}

    const getImpactStyles = (level: string) => {
        switch (level.toLowerCase()) {
            case 'high': return 'bg-indigo-600 text-white'
            case 'medium': return 'bg-blue-500 text-white'
            default: return 'bg-gray-500 text-white'
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <Link to="/aiinsight" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={16} />
                    Back to AI Insights
                </Link>
                <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold text-sm disabled:opacity-50"
                >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    {isDeleting ? "Deleting..." : "Delete Prediction"}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl">
                            <Sparkles size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{prediction.title}</h1>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">AI-Powered Market Forecast</p>
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
                        Confidence Score: 94%
                    </div>
                </div>

                <div className="p-8 space-y-12">
                    {/* Executive Summary */}
                    <section className="space-y-4">
                        <h2 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquareText size={16} /> Analysis Context
                        </h2>
                        <div className="space-y-4">
                            {description.map((text, i) => (
                                <p key={i} className="text-base text-gray-700 dark:text-slate-300 leading-relaxed">
                                    {text}
                                </p>
                            ))}
                        </div>
                    </section>

                    {/* Prediction Grid */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Target size={16} /> Forecasting Breakdown
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {predictionsData.map((p, i) => (
                                <div key={i} className="p-6 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/40 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-indigo-600 dark:text-indigo-400">
                                            <Zap size={20} fill="currentColor" />
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getImpactStyles(p.impact_level)}`}>
                                            {p.impact_level} Impact
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-slate-50">{p.prediction_title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{p.details}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Calendar size={12} /> {p.timeframe}
                                        </span>
                                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                                            {p.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="p-8 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <BarChart3 size={32} className="text-indigo-600" />
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-slate-100">Want deeper analysis?</p>
                            <p className="text-xs text-gray-500">Run a full simulation based on these predictions.</p>
                        </div>
                    </div>
                    <Link to="/scenario" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all text-center">
                        Simulate Scenarios
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SinglePrediction
