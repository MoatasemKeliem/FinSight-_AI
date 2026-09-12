import { Link } from "react-router-dom"
import { TrendingUp, ShieldCheck, Zap, ArrowRight, PieChart, Sparkles } from "lucide-react"

const HomePage = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full py-20 px-4 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
                    <Sparkles size={14} />
                    <span>Next-Gen Financial Intelligence</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-slate-50 tracking-tight max-w-4xl leading-[1.1]">
                    Master Your Finances with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">AI-Powered</span> Insights.
                </h1>
                
                <p className="text-lg md:text-xl text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                    Finsight AI transforms raw financial data into actionable intelligence. Predict market trends, analyze risks, and make data-driven decisions in seconds.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 group">
                        Get Started Free
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/login" className="px-8 py-4 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-50 border border-gray-200 dark:border-slate-800 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                        View Demo
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="w-full py-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {[
                    {
                        title: "AI Risk Analysis",
                        desc: "Detect potential financial pitfalls before they happen with our advanced risk assessment engine.",
                        icon: <ShieldCheck className="text-red-500" />,
                        color: "bg-red-50 dark:bg-red-900/10"
                    },
                    {
                        title: "Predictive Forecasting",
                        desc: "Leverage machine learning to project future cash flows and market movements with high accuracy.",
                        icon: <TrendingUp className="text-emerald-500" />,
                        color: "bg-emerald-50 dark:bg-emerald-900/10"
                    },
                    {
                        title: "Automated Insights",
                        desc: "Upload documents and instantly receive high-level executive summaries and recommendations.",
                        icon: <Zap className="text-amber-500" />,
                        color: "bg-amber-50 dark:bg-amber-900/10"
                    }
                ].map((feature, i) => (
                    <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group">
                        <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">{feature.title}</h3>
                        <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                    </div>
                ))}
            </section>

            {/* CTA Section */}
            <section className="w-full my-20 p-12 bg-indigo-600 rounded-[2rem] text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <PieChart size={400} className="absolute -top-20 -right-20" />
                </div>
                <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to transform your financial future?</h2>
                    <p className="text-indigo-100 max-w-xl mx-auto text-lg">Join 10,000+ businesses using Finsight AI to scale their operations with confidence.</p>
                    <Link to="/register" className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all">
                        Create Your Free Account
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default HomePage
