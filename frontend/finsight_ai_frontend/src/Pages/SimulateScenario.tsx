import { useState } from "react"
import SimulateScenarioComponent from "../Components/SimulateScenarioComponent"
import { Microscope, PlayCircle, Loader2, CheckCircle2 } from "lucide-react"
import { AISimulateScenario } from "../api/AIAPI"

const SimulateScenario = () => {
    const [isSimulating, setIsSimulating] = useState(false)
    const [simSuccess, setSimSuccess] = useState(false)

    const handleNewSimulation = async () => {
        setIsSimulating(true)
        setSimSuccess(false)
        try {
            await AISimulateScenario({ scenario: "Strategic Growth" })
            setSimSuccess(true)
            setTimeout(() => {
                setSimSuccess(false)
                window.location.reload()
            }, 2000)
        } catch (error) {
            console.error("Simulation Error:", error)
        } finally {
            setIsSimulating(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
                        <Microscope className="text-violet-600" />
                        What-If Simulations
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Explore the financial impact of strategic business decisions.</p>
                </div>
                <button 
                    onClick={handleNewSimulation}
                    disabled={isSimulating}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-violet-200 dark:shadow-none transition-all disabled:opacity-50"
                >
                    {isSimulating ? <Loader2 size={20} className="animate-spin" /> : (simSuccess ? <CheckCircle2 size={20} /> : <PlayCircle size={20} />)}
                    {isSimulating ? "Simulating..." : (simSuccess ? "Simulation Complete" : "New Simulation")}
                </button>
            </div>

            <div className="max-w-4xl">
                <SimulateScenarioComponent numberofScenario={10} />
            </div>
        </div>
    )
}

export default SimulateScenario
