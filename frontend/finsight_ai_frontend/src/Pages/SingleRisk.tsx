import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { GetRiskAnalysisById, DeleteRiskAnalysisById } from '../api/riskAnalysis'
import type { IRiskAnalysis } from '../model/IRiskAnalysisModel'
import { ShieldAlert, AlertTriangle, ArrowLeft, CheckCircle, Info, Activity, Trash2, Loader2 } from 'lucide-react'

const SingleRisk = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [analysis, setAnalysis] = useState<IRiskAnalysis | null>(null)
    const [loading, setLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (id) {
                try {
                    const data = await GetRiskAnalysisById(id)
                    setAnalysis(data)
                } catch (error) {
                    console.error("Error fetching risk analysis:", error)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchAnalysis()
    }, [id])

    const handleDelete = async () => {
        if (!id || !window.confirm("Are you sure you want to delete this risk analysis? This action cannot be undone.")) return
        setIsDeleting(true)
        try {
            await DeleteRiskAnalysisById(id)
            navigate("/aiinsight")
        } catch (error) {
            console.error("Delete Error:", error)
            alert("Failed to delete analysis. Please try again.")
        } finally {
            setIsDeleting(false)
        }
    }

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
    if (!analysis) return <div className="text-center py-20"><p className="text-gray-500">Analysis not found.</p><Link to="/aiinsight" className="text-indigo-600 hover:underline">Return to Insights</Link></div>

    const parsedDescription: string[] = JSON.parse(analysis.description)
    const parsedRisks: {
        Type: string
        Severity: string
        Observation: string
        Recommendation: string
    }[] = JSON.parse(analysis.risksJson)

    const getSeverityStyles = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high':
            case 'critical':
                return 'bg-red-100 text-red-700 border-red-200'
            case 'medium':
                return 'bg-amber-100 text-amber-700 border-amber-200'
            default:
                return 'bg-emerald-100 text-emerald-700 border-emerald-200'
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
                    {isDeleting ? "Deleting..." : "Delete Analysis"}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-200 dark:shadow-none">
                            <ShieldAlert size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">{analysis.title}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Activity size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest">Neural Risk Mapping</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Analysis ID: {analysis.id?.slice(0, 8)}</span>
                    </div>
                </div>

                <div className="p-8 space-y-12">
                    {/* Executive Summary */}
                    <section className="space-y-4">
                        <h2 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Info size={16} /> Executive Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {parsedDescription.map((desc, i) => (
                                <p key={i} className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                                    {desc}
                                </p>
                            ))}
                        </div>
                    </section>

                    {/* Detailed Risk Breakdown */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle size={16} /> Identified Threats & Mitigations
                        </h2>
                        <div className="space-y-6">
                            {parsedRisks.map((risk, i) => (
                                <div key={i} className="p-6 rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50">{risk.Type}</h3>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getSeverityStyles(risk.Severity)}`}>
                                            {risk.Severity} Severity
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Observation</p>
                                            <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed italic">
                                                "{risk.Observation}"
                                            </p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                <CheckCircle size={14} /> Recommended Mitigation
                                            </p>
                                            <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium leading-relaxed">
                                                {risk.Recommendation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="p-8 bg-indigo-600 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold">Ready to take action?</h3>
                        <p className="text-indigo-100 text-sm">Convert this analysis into a strategic business decision.</p>
                    </div>
                    <Link to="/scenario" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all text-center">
                        Launch Scenario Simulator
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SingleRisk
