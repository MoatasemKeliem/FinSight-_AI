import { useEffect, useState } from 'react'
import { GetAllScenarios, DeleteScenarioById } from '../api/simulateScenario'
import type { IFinancialImpact, ISimulateScenario, IChartData } from '../model/SimulateScenarioModel'
import { Microscope, Target, BarChart4, TrendingUp, AlertCircle, ChevronRight, Zap, Trash2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import SimpleChart from './SimpleChart'

interface ISimulateProps {
    numberofScenario: number
    short?: boolean
}

const SimulateScenarioComponent = ({ numberofScenario, short = false }: ISimulateProps) => {
    const [scenario, setScenario] = useState<ISimulateScenario[]>([])
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const getData = async () => {
        const response = await GetAllScenarios()
        setScenario(response);
    }

    useEffect(() => {
        getData()
    }, [])

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this simulation?")) return
        setIsDeleting(id)
        try {
            await DeleteScenarioById(id)
            await getData()
        } catch (error) {
            console.error("Delete Error:", error)
            alert("Failed to delete scenario.")
        } finally {
            setIsDeleting(null)
        }
    }

    const displaySimulate = typeof numberofScenario === "number"
        ? scenario.slice(0, numberofScenario)
        : scenario

    const formatCurrency = (amount: any) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(numAmount);
    }

    return (
        <div className="space-y-8">
            {displaySimulate.map((item) => {

                let financial: IFinancialImpact = { baseline_monthly_net: "0", projected_monthly_net: "0", runway_impact: "N/A" };
                try {
                    if (item.financialImpactJson) {
                        financial = JSON.parse(item.financialImpactJson);
                    }
                } catch (e) {
                    console.error("Failed to parse financial impact:", e);
                }

                let chartData: IChartData = { x_axis_label: "", y_axis_label: "", labels: [], data: [] };
                try {
                    const rawChartData = item.chartUrl || item.chartData;

                    if (rawChartData) {
                        chartData = typeof rawChartData === 'string'
                            ? JSON.parse(rawChartData)
                            : rawChartData;
                    }
                } catch (e) {
                    console.error("Failed to parse chart data:", e);
                }

                const baseline = parseFloat(financial.baseline_monthly_net)
                const projected = parseFloat(financial.projected_monthly_net)
                const isPositive = projected > baseline

                return (
                    <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                        {/* Card Header */}
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-violet-50/50 to-transparent dark:from-violet-900/10 dark:to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-200 dark:shadow-none">
                                    <Microscope size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-slate-50">{item.title}</h3>
                                    <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold uppercase tracking-widest">Strategic Simulation</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <BarChart4 size={20} className="text-gray-400" />
                                <button
                                    onClick={() => item.id && handleDelete(item.id)}
                                    disabled={!!isDeleting}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                >
                                    {isDeleting === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Summary */}
                            {!short && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Target size={14} /> Scenario Summary
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed border-l-2 border-violet-100 dark:border-slate-800 pl-4">
                                        {item.scenarioSummary}
                                    </p>
                                </div>
                            )}

                            {/* Impact Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800/60">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-2">Baseline Net</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-slate-100">{formatCurrency(baseline)}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Current monthly avg</p>
                                </div>
                                <div className="p-4 rounded-xl bg-violet-50/30 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/20">
                                    <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase mb-2">Projected Net</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-bold text-gray-900 dark:text-slate-100">{formatCurrency(projected)}</p>
                                        <TrendingUp size={16} className={isPositive ? "text-emerald-500" : "text-red-500 rotate-180"} />
                                    </div>
                                    <p className={`text-[10px] font-bold mt-1 ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                                        {isPositive ? "+" : ""}{Math.round(((projected - baseline) / baseline) * 100)}% delta
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20">
                                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Runway Impact</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{financial.runway_impact}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Capital endurance</p>
                                </div>
                            </div>

                            {!short && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Analysis */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Zap size={14} /> Qualitative Analysis
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed italic">
                                            {item.qualitativeAnalysis}
                                        </p>

                                        <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-800 text-white space-y-2">
                                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <AlertCircle size={12} className="text-amber-400" /> Final Verdict
                                            </h5>
                                            <p className="text-sm font-medium leading-relaxed">
                                                {item.finalVerdict}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Chart Rendering */}
                                    <div className="flex items-center justify-center min-h-[200px]">
                                        <SimpleChart data={chartData} />
                                    </div>
                                </div>
                            )}

                            {short && (
                                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                                    <h5 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Verdict</h5>
                                    <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium line-clamp-2">
                                        {item.finalVerdict}
                                    </p>
                                </div>
                            )}
                        </div>

                        {short && (
                            <div className="px-6 py-3 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                                <Link to="/scenario" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                    Explore full simulation <ChevronRight size={14} />
                                </Link>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default SimulateScenarioComponent
