import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
    Sparkles, 
    FileText, 
    ShieldAlert, 
    Zap, 
    ArrowRight, 
    BrainCircuit, 
    Loader2, 
    CheckCircle2, 
    PlusCircle, 
    X,
    FileDown
} from "lucide-react"
import { AIAnalyze, AIPrediction, AIRecommendation } from "../api/AIAPI"
import { downloadDocument } from "../api/ReportApi"
import InsertInsight from "../Components/InsertInsight"

const GenerateReport = () => {
    const navigate = useNavigate()
    const [loadingType, setLoadingType] = useState<string | null>(null)
    const [status, setStatus] = useState<{ type: string, message: string, success: boolean } | null>(null)
    const [showManualForm, setShowManualForm] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const handleGenerate = async (type: string) => {
        setLoadingType(type)
        setStatus(null)
        try {
            if (type === "Risk") {
                await AIAnalyze()
                setStatus({ type: "Risk", message: "Risk analysis generated successfully!", success: true })
                setTimeout(() => navigate("/risk"), 2000)
            } else if (type === "Predictions") {
                await AIPrediction({ type: "Market" })
                setStatus({ type: "Predictions", message: "Market predictions updated!", success: true })
                setTimeout(() => navigate("/predictions"), 2000)
            } else if (type === "Recommendations") {
                await AIRecommendation({ type: "Strategic" })
                setStatus({ type: "Recommendations", message: "Recommendations refreshed!", success: true })
                setTimeout(() => navigate("/recommendations"), 2000)
            }
        } catch (error) {
            console.error(`Error generating ${type}:`, error)
            setStatus({ type, message: `Failed to generate ${type}. Please try again.`, success: false })
        } finally {
            setLoadingType(null)
        }
    }

    const handleDownloadSummary = async () => {
        setIsDownloading(true)
        try {
            const blob = await downloadDocument()
            const url = window.URL.createObjectURL(new Blob([blob]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'Finsight_Executive_Summary.pdf')
            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Download Error:", error)
            alert("Failed to generate executive summary PDF. Please try again.")
        } finally {
            setIsDownloading(false)
        }
    }

    const reportTypes = [
        {
            title: "Comprehensive Risk Assessment",
            desc: "Deep neural analysis of external market risks and internal financial vulnerabilities.",
            icon: <ShieldAlert className="text-red-500" />,
            type: "Risk",
            color: "bg-red-50 dark:bg-red-900/20"
        },
        {
            title: "Market Trend Predictions",
            desc: "Machine learning forecasts for cash flow, revenue, and sector performance.",
            icon: <Sparkles className="text-indigo-500" />,
            type: "Predictions",
            color: "bg-indigo-50 dark:bg-indigo-900/20"
        },
        {
            title: "Strategic Recommendations",
            desc: "Actionable business intelligence and cost-optimization guide.",
            icon: <Zap className="text-amber-500" />,
            type: "Recommendations",
            color: "bg-amber-50 dark:bg-amber-900/20"
        },
        {
            title: "Document Intelligence",
            desc: "Summary and key takeaway extraction from corporate PDF documents.",
            icon: <FileText className="text-blue-500" />,
            to: "/documents",
            color: "bg-blue-50 dark:bg-blue-900/20"
        }
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="text-left space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
                        <BrainCircuit size={14} />
                        <span>AI Report Generator</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 tracking-tight">Generate Strategy</h1>
                    <p className="text-lg text-gray-500 dark:text-slate-400 max-w-xl">Select a specialized AI model to generate your strategic report or export a master summary.</p>
                </div>
                
                <button 
                    onClick={handleDownloadSummary}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isDownloading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <FileDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
                    )}
                    <span>{isDownloading ? "Generating PDF..." : "Export Exec Summary"}</span>
                </button>
            </div>

            {showManualForm ? (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowManualForm(false)}
                            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors uppercase tracking-widest bg-gray-100 dark:bg-slate-800 px-6 py-2 rounded-full"
                        >
                            <X size={16} /> Close Manual Entry
                        </button>
                    </div>
                    <InsertInsight onClose={() => setShowManualForm(false)} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reportTypes.map((report, i) => {
                        const isLoading = loadingType === report.type
                        const isSuccess = status?.type === report.type && status?.success

                        return (
                            <div
                                key={i}
                                onClick={() => report.type && !loadingType && handleGenerate(report.type)}
                                className={`group bg-white dark:bg-slate-900 p-8 rounded-3xl border transition-all hover:shadow-xl cursor-pointer ${isSuccess ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200 dark:border-slate-800 hover:border-indigo-50'
                                    }`}
                            >
                                {report.to ? (
                                    <Link to={report.to}>
                                        <div className={`w-14 h-14 rounded-2xl ${report.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            {report.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">{report.title}</h3>
                                        <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-sm mb-6">{report.desc}</p>
                                        <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                            View Library
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-14 h-14 rounded-2xl ${report.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                {report.icon}
                                            </div>
                                            {isLoading && <Loader2 size={24} className="animate-spin text-indigo-600" />}
                                            {isSuccess && <CheckCircle2 size={24} className="text-emerald-500" />}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">{report.title}</h3>
                                        <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-sm mb-6">{report.desc}</p>

                                        {status?.type === report.type && status && (
                                            <p className={`text-xs font-bold mb-4 ${status.success ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {status.message}
                                            </p>
                                        )}
                                        <button
                                            disabled={!!loadingType}
                                            className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest disabled:opacity-50"
                                        >
                                            {isLoading ? 'Processing...' : 'Run Neural Analysis'}
                                            {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                                        </button>
                                    </>
                                )}
                            </div>
                        )
                    })}

                    {/* Manual Entry Card */}
                    <div
                        onClick={() => setShowManualForm(true)}
                        className="group bg-indigo-600 p-8 rounded-3xl border border-transparent transition-all hover:shadow-xl hover:shadow-indigo-500/20 cursor-pointer flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white">
                                <PlusCircle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Manual Insight Entry</h3>
                            <p className="text-indigo-100 leading-relaxed text-sm mb-6">Manually insert financial records or business decisions to include in future AI analysis.</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest">
                            Open Form
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            )}

            <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-bold">Custom Neural Request</h3>
                    <p className="text-slate-400 max-w-sm">Have a specific question not covered by our standard reports?</p>
                </div>
                <Link to="/chat" className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2">
                    Open AI Chat
                </Link>
            </div>
        </div>
    )
}

export default GenerateReport
