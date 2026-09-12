import { useState } from "react"
import PredictionsComponent from "../Components/PredictionsComponent"
import RecommendationsComponent from "../Components/RecommendationsComponent"
import RiskAnalysisComponent from "../Components/RiskAnalysisComponent"
import { Lightbulb, Sparkles, BrainCircuit, Loader2, CheckCircle2 } from "lucide-react"
import { AIAnalyze } from "../api/AIAPI"

const AIInsights = () => {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [refreshSuccess, setRefreshSuccess] = useState(false)

    const handleRefresh = async () => {
        setIsRefreshing(true)
        setRefreshSuccess(false)
        try {
            await AIAnalyze()
            setRefreshSuccess(true)
            setTimeout(() => setRefreshSuccess(false), 3000)
            // Ideally this would trigger a re-fetch in child components
            // For now, we just show success. In a real app, we'd use a key or context.
            window.location.reload(); // Simple way to force re-fetch for now
        } catch (error) {
            console.error("Analysis Error:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="relative p-8 rounded-3xl bg-indigo-600 overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                            <Sparkles size={12} />
                            <span>Neural Analysis Active</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <BrainCircuit size={32} />
                            AI Insights & Strategy
                        </h1>
                        <p className="text-indigo-100 max-w-xl text-sm leading-relaxed">
                            Our advanced AI models have analyzed your financial records and market trends to generate these strategic observations.
                        </p>
                    </div>
                    <button 
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isRefreshing ? <Loader2 size={20} className="animate-spin" /> : (refreshSuccess ? <CheckCircle2 size={20} /> : null)}
                        {isRefreshing ? "Analyzing..." : (refreshSuccess ? "Analysis Complete" : "Refresh Analysis")}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recommendations Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Lightbulb size={20} className="text-amber-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Strategic Recommendations</h2>
                    </div>
                    <RecommendationsComponent />
                </section>

                {/* Risk Analysis Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Market Predictions</h2>
                    </div>
                    <PredictionsComponent />
                </section>
            </div>

            {/* Risk Section Full Width */}
            <section className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2 px-2">
                    <BrainCircuit size={20} className="text-red-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Comprehensive Risk Assessment</h2>
                </div>
                <RiskAnalysisComponent />
            </section>
        </div>
    )
}

export default AIInsights
