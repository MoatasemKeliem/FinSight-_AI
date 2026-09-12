import { useEffect, useState } from 'react'
import { GetAllCompanyProfiles } from '../api/companyProfile'
import type { ICompanyPRofiles } from '../model/companyProfileModel'
import { Building2, Globe, BarChart3, Wallet, CreditCard, Landmark, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CompanyProfileProps {
    numberOfProfiles?: number;
    short?: boolean
}

const CompanyProfileComponent = ({ numberOfProfiles, short = false }: CompanyProfileProps) => {
    const [companyData, setCompanyData] = useState<ICompanyPRofiles[]>([])

    useEffect(() => {
        const resposne = async () => {
            const data = await GetAllCompanyProfiles();
            setCompanyData(data)
        }
        resposne()
    }, [])

    const displayedCompanies = typeof numberOfProfiles === "number"
        ? companyData.slice(0, numberOfProfiles)
        : companyData

    const formatCurrency = (amount: number, currency: any) => {
        // Handle weird currency array type in model
        const currencyCode = Array.isArray(currency) ? currency[0] : (currency || 'USD');
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: typeof currencyCode === 'string' ? currencyCode : 'USD',
        }).format(amount);
    }

    return (
        <div className="space-y-6">
            {displayedCompanies.map((company) => {
                return (
                    <div key={company.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
                        {/* Header/Banner Placeholder */}
                        <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
                            <div className="absolute -bottom-6 left-6">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border-4 border-white dark:border-slate-900 shadow-lg text-indigo-600 dark:text-indigo-400">
                                    <Building2 size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 px-6 pb-6 space-y-6">
                            {/* Basic Info */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">{company.companyName}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Globe size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">{company.industry}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg text-sm font-bold border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                        Edit Profile
                                    </button>
                                </div>
                            </div>

                            {!short && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                            <Wallet size={12} className="text-emerald-500" /> Monthly Revenue
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-slate-100">
                                            {formatCurrency(company.monthlyRevenue, company.currency)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                            <CreditCard size={12} className="text-red-500" /> Monthly Costs
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-slate-100">
                                            {formatCurrency(company.monthlyCosts, company.currency)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                            <Landmark size={12} className="text-indigo-500" /> Net Margin
                                        </p>
                                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                            {Math.round(((company.monthlyRevenue - company.monthlyCosts) / company.monthlyRevenue) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            )}

                            {short && (
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                            <BarChart3 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Current Industry</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{company.industry}</p>
                                        </div>
                                    </div>
                                    <Link to="/companyprofile" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                                        Settings <ChevronRight size={14} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CompanyProfileComponent

