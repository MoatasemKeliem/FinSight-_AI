import RiskAnalysisComponent from "../Components/RiskAnalysisComponent"
import { ShieldAlert } from "lucide-react"

const RiskAnalysis = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
                    <ShieldAlert className="text-red-500" />
                    Risk Assessment
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Deep analysis of internal and external risks affecting your business stability.</p>
            </div>

            <div className="max-w-4xl">
                <RiskAnalysisComponent />
            </div>
        </div>
    )
}

export default RiskAnalysis
