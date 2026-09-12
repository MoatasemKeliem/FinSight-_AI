import CompanyProfileForm from "./CompanyProfileForm"
import { Landmark } from "lucide-react"

const Onboarding = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4 py-12">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
                        <Landmark size={14} />
                        <span>Final Step: Company Setup</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 tracking-tight">Tell us about your business</h1>
                    <p className="text-lg text-gray-500 dark:text-slate-400">This information helps our AI models provide more accurate financial insights tailored to your industry.</p>
                </div>

                <CompanyProfileForm />
            </div>
        </div>
    )
}

export default Onboarding
