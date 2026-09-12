import PredictionsComponent from "../Components/PredictionsComponent"
import { Sparkles } from "lucide-react"

const Predictions = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
                    <Sparkles className="text-indigo-600" />
                    Market Predictions
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">AI-driven forecasts based on global market trends and your internal data.</p>
            </div>

            <div className="max-w-5xl">
                <PredictionsComponent />
            </div>
        </div>
    )
}

export default Predictions
