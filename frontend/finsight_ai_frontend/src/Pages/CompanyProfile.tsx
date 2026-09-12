import CompanyProfileComponent from "../Components/CompanyProfileComponent"
import BusinessDecisionComponent from "../Components/BusinessDecisionComponent"
import { Settings, Building2, Briefcase } from "lucide-react"

const CompanyProfile = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
                    <Settings className="text-gray-400" />
                    Workspace Settings
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your company profile and track strategic business decisions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Building2 size={20} className="text-indigo-600 dark:text-indigo-400" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Company Profile</h2>
                        </div>
                        <CompanyProfileComponent />
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Briefcase size={20} className="text-amber-500" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Strategic Decisions</h2>
                        </div>
                        <BusinessDecisionComponent />
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CompanyProfile
