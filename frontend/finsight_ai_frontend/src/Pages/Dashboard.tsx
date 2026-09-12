import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import DocumentComponent from "../Components/DocumentComponent"
import FinancialRecords from "../Components/FinancialRecords"
import PredictionsComponent from "../Components/PredictionsComponent"
import RiskAnalysisComponent from "../Components/RiskAnalysisComponent"
import RecommendationsComponent from "../Components/RecommendationsComponent"
import { LayoutDashboard, TrendingUp, TrendingDown, AlertCircle, FileText, Lightbulb, UploadCloud, Loader2 } from "lucide-react"
import { CreateDocumentById, GetAllDocuments } from "../api/document"
import { GetAllRiskAnalyses } from "../api/riskAnalysis"
import { GetAllRecommendation } from "../api/recommendation"
import { GetAllCompanyProfiles } from "../api/companyProfile"

const Dashboard = () => {
    const [isUploading, setIsUploading] = useState(false)
    const [stats, setStats] = useState({
        revenue: 0,
        risks: 0,
        docs: 0,
        netProfit: 0,
        recommendations: 0,
        loading: true
    })
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [financials, risks, docs, recs] = await Promise.all([
                    GetAllCompanyProfiles(),
                    GetAllRiskAnalyses(),
                    GetAllDocuments(),
                    GetAllRecommendation()
                ]);



                const revenue = financials.map((item: any) => item.monthlyRevenue)
                const cost = financials.map((item: any) => item.monthlyCosts)
                const totalRevenue = revenue - cost;
                const netProfitPercent = (totalRevenue / revenue) * 100


                // Calculate Total Risks
                const totalRisks = risks.reduce((acc: number, curr: any) => {
                    try {
                        const parsed = JSON.parse(curr.risksJson);
                        return acc + (Array.isArray(parsed) ? parsed.length : 0);
                    } catch (e) { return acc; }
                }, 0);

                // Calculate Total Recommendations
                const totalRecs = recs.reduce((acc: number, curr: any) => {
                    try {
                        const parsed = JSON.parse(curr.description);
                        return acc + (Array.isArray(parsed) ? parsed.length : 0);
                    } catch (e) { return acc; }
                }, 0);

                setStats({
                    revenue: totalRevenue,
                    risks: totalRisks,
                    docs: docs.length,
                    netProfit: netProfitPercent,
                    recommendations: totalRecs,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            await CreateDocumentById(file)
            alert("File uploaded successfully!")
            window.location.reload(); // Refresh to show new doc
        } catch (error) {
            console.error("Upload Error:", error)
            alert("Failed to upload file.")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }
    const isProfitPositive = stats.netProfit >= 0;
    const statCards = [
        {
            label: "Net Profit", value: `$${stats.revenue.toLocaleString()}`, change: `${isProfitPositive ? '+' : ''}${stats.netProfit.toFixed(1)}%`, icon: isProfitPositive ? <TrendingUp className="text-emerald-500" /> : <TrendingDown className="text-red-500" />, pillColors: isProfitPositive
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
        },
        { label: "Active Risks", value: stats.risks.toString(), change: "Detected by AI", icon: <AlertCircle className="text-amber-500" /> },
        { label: "Processed Docs", value: stats.docs.toString(), change: "In storage", icon: <FileText className="text-blue-500" /> },
        { label: "AI Recommendations", value: stats.recommendations.toString(), change: "Strategic items", icon: <Lightbulb className="text-indigo-500" /> },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight">Executive Dashboard</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Real-time financial intelligence and AI-driven insights.</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                    />
                    <Link to="/generate_report" className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-center">
                        Generate Report
                    </Link>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm shadow-indigo-200 dark:shadow-none disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                        {isUploading ? "Uploading..." : "Upload Data"}
                    </button>
                </div>
            </div>


            {/* Top Stats/Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg">{stat.icon}</div>
                            {!stats.loading && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${stat.pillColors}`}>
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-medium text-gray-500 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        {stats.loading ? (
                            <div className="h-8 w-24 bg-gray-100 dark:bg-slate-800 animate-pulse rounded mt-1" />
                        ) : (
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mt-1">{stat.value}</h4>
                        )}
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Financials & Risks */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Financial Performance</h2>
                        </div>
                        <FinancialRecords numberOfRecords={5} short={true} />
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle size={20} className="text-red-500" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Critical Risk Analysis</h2>
                        </div>
                        <RiskAnalysisComponent numberOfRisks={1} short={true} />
                    </section>
                </div>

                {/* Right Column: AI Insights & Documents */}
                <div className="space-y-8">
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Lightbulb size={20} className="text-amber-500" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Top Recommendations</h2>
                        </div>
                        <RecommendationsComponent numberOfRecommendation={2} short={true} />
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText size={20} className="text-blue-500" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Recent Documents</h2>
                        </div>
                        <DocumentComponent numberOfDocuments={4} short={true} />
                    </section>
                </div>
            </div>

            {/* Bottom Row: AI Predictions */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <LayoutDashboard size={20} className="text-purple-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">AI Market Predictions</h2>
                </div>
                <PredictionsComponent numberOfPredictions={1} short={true} />
            </section>
        </div>
    )
}

export default Dashboard
