import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, Globe, Wallet, CreditCard, Landmark, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { CreateCompanyProfile } from "../api/companyProfile"
import { useAuth } from "../Context/AuthContext"
import type { ICreateCompanyProfiles } from "../model/companyProfileModel"

const CompanyProfileForm = () => {
    const { checkStatus } = useAuth()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<ICreateCompanyProfiles>({
        companyName: "",
        industry: "Technology" as any,
        monthlyRevenue: 0,
        monthlyCosts: 0,
        currency: "USD" as any
    })

    const industries = [
        "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
        "Retail", "Energy", "Transportation", "Entertainment", "Agriculture"
    ]

    const currencies = [
        "USD", "EUR", "GBP", "SEK", "NOK", "DKK", "JPY", "CNY", "AUD", "CAD", "AED", "SAR"
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await CreateCompanyProfile(formData)
            await checkStatus() // Refresh profile status in context
            navigate("/dashboard")
        } catch (err: any) {
            console.error("Profile Creation Error:", err)
            setError("Failed to create profile. Please check your data and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-2xl shadow-indigo-100/50 dark:shadow-none overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                        <CheckCircle2 className="rotate-180" size={18} />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Building2 size={14} /> Company Name
                        </label>
                        <input 
                            type="text"
                            required
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-100"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Globe size={14} /> Industry
                        </label>
                        <select 
                            value={formData.industry as any}
                            onChange={(e) => setFormData({...formData, industry: e.target.value as any})}
                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-100 appearance-none"
                        >
                            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Wallet size={14} /> Est. Monthly Revenue
                        </label>
                        <input 
                            type="number"
                            required
                            value={formData.monthlyRevenue}
                            onChange={(e) => setFormData({...formData, monthlyRevenue: parseFloat(e.target.value)})}
                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-100"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <CreditCard size={14} /> Est. Monthly Costs
                        </label>
                        <input 
                            type="number"
                            required
                            value={formData.monthlyCosts}
                            onChange={(e) => setFormData({...formData, monthlyCosts: parseFloat(e.target.value)})}
                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-100"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Landmark size={14} /> Preferred Currency
                    </label>
                    <select 
                        value={formData.currency as any}
                        onChange={(e) => setFormData({...formData, currency: e.target.value as any})}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-100 appearance-none"
                    >
                        {currencies.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                    </select>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <span>Initialize My Dashboard</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CompanyProfileForm
