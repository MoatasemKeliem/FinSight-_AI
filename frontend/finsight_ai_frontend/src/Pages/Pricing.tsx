import { Check, Sparkles } from "lucide-react"

const Pricing = () => {
    const tiers = [
        {
            name: "Starter",
            price: "$0",
            desc: "Perfect for exploring AI financial insights.",
            features: ["5 Document Uploads/mo", "Basic Risk Analysis", "Daily Market Predictions", "Community Support"],
            button: "Get Started",
            popular: false
        },
        {
            name: "Professional",
            price: "$49",
            desc: "Advanced intelligence for growing businesses.",
            features: ["Unlimited Uploads", "Deep Neural Risk Analysis", "Advanced What-If Simulations", "Priority AI Chat", "Exportable Reports"],
            button: "Start Free Trial",
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            desc: "Full-scale neural intelligence for large firms.",
            features: ["Custom AI Model Training", "Multi-user Workspaces", "API Access", "Dedicated Account Manager", "SLA & SSO"],
            button: "Contact Sales",
            popular: false
        }
    ]

    return (
        <div className="space-y-12 py-10 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-50 tracking-tight">Simple, Transparent Pricing</h1>
                <p className="text-lg text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">Choose the plan that fits your intelligence needs. Scale as you grow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {tiers.map((tier, i) => (
                    <div 
                        key={i} 
                        className={`relative p-8 rounded-3xl border transition-all duration-300 hover:translate-y-[-4px] ${
                            tier.popular 
                                ? "bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-100 dark:shadow-none scale-105 z-10" 
                                : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-sm"
                        }`}
                    >
                        {tier.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                <Sparkles size={12} />
                                Most Popular
                            </div>
                        )}

                        <div className="space-y-2 mb-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50">{tier.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{tier.desc}</p>
                        </div>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-extrabold text-gray-900 dark:text-slate-50">{tier.price}</span>
                            {tier.price !== "Custom" && <span className="text-gray-500 dark:text-slate-500 font-medium">/month</span>}
                        </div>

                        <ul className="space-y-4 mb-10">
                            {tier.features.map((feature, j) => (
                                <li key={j} className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
                                    <div className="p-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                        <Check size={14} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-3 rounded-xl font-bold transition-all ${
                            tier.popular 
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                                : "bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-50 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                        }`}>
                            {tier.button}
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="text-center pt-10">
                <p className="text-sm text-gray-500 dark:text-slate-500 italic">
                    All plans include 256-bit SSL encryption and SOC2 compliant data storage.
                </p>
            </div>
        </div>
    )
}

export default Pricing
