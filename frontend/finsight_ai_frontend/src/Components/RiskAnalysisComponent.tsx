import { useEffect, useState } from 'react'
import type { IRiskAnalysis } from '../model/IRiskAnalysisModel'
import { GetAllRiskAnalyses } from '../api/riskAnalysis'
import { AlertTriangle, ShieldAlert, CheckCircle, Info, ChevronRight, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

interface IRiskProps {
    numberOfRisks?: number
    short?: boolean
}

const RiskAnalysisComponent = ({ numberOfRisks, short = false }: IRiskProps) => {
    const [risk, setRisk] = useState<IRiskAnalysis[]>([])

    useEffect(() => {
        const getData = async () => {
            const response = await GetAllRiskAnalyses()
            setRisk(response);
        }

        getData()
    }, [])

    const displayRisk = typeof numberOfRisks === "number"
        ? risk.slice(0, numberOfRisks)
        : risk

    const getSeverityStyles = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high':
            case 'critical':
                return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
            case 'medium':
            case 'moderate':
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
            case 'low':
                return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
            default:
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
        }
    }

    return (
        <div className="space-y-6">
            {displayRisk.length > 0 ? (
                displayRisk.map((item) => {
                    const parsedDescription: string[] = JSON.parse(item.description)
                    const parsedRisk: {
                        Type: string
                        Severity: string
                        Observation: string
                        Recommendation: string
                    }[] = JSON.parse(item.risksJson)

                    return (
                        <Link key={item.id} to={`/single_Risk/${item.id}`} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200 block hover:border-indigo-500">
                            {/* Card Header */}
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-slate-50">{item.title}</h3>
                                </div>
                                <Activity size={18} className="text-gray-400" />
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Description Section */}
                                {!short && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Info size={14} /> Analysis Overview
                                        </h4>
                                        <div className="space-y-2">
                                            {parsedDescription.map((desc, index) => (
                                                <p key={index} className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                                                    {desc}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Risk Grid */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <AlertTriangle size={14} /> Identified Risks
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        {parsedRisk.map((riskItem, index) => (
                                            <div 
                                                key={index} 
                                                className="p-4 rounded-lg border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/20 hover:border-gray-200 dark:hover:border-slate-700 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{riskItem.Type}</p>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityStyles(riskItem.Severity)}`}>
                                                            {riskItem.Severity}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {!short && (
                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-1">Observation</p>
                                                            <p className="text-sm text-gray-600 dark:text-slate-400">{riskItem.Observation}</p>
                                                        </div>
                                                        <div className="p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-md border border-emerald-100 dark:border-emerald-900/20">
                                                            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-500 uppercase mb-1 flex items-center gap-1">
                                                                <CheckCircle size={10} /> Mitigation Strategy
                                                            </p>
                                                            <p className="text-sm text-emerald-800/80 dark:text-emerald-400/80 italic">
                                                                "{riskItem.Recommendation}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {short && (
                                <div className="px-6 py-3 bg-gray-50/30 dark:bg-slate-800/20 border-t border-gray-100 dark:border-slate-800">
                                    <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                        View full risk report <ChevronRight size={14} />
                                    </div>
                                </div>
                            )}
                        </Link>
                    )
                })
            ) : (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                        <ShieldAlert size={32} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">No risks identified</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs mx-auto">
                            The AI has not detected any critical risks in your current data. Upload new documents to trigger a refresh.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RiskAnalysisComponent
