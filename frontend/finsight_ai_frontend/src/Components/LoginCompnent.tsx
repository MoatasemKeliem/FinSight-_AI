import { useState, type FormEvent } from "react"
import type { ILogin } from "../model/auth"
import { login } from "../api/auth"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react"

const LoginCompnent = () => {
    const { checkStatus } = useAuth()
    const [loginUser, setLoginUser] = useState<ILogin>({
        email: "",
        password: ""
    })
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            await login(loginUser)
            await checkStatus();
            navigate("/dashboard")
        } catch (error: any) {
            console.error("LOGIN ERROR", error.response?.data || error.message)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-12">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Welcome back</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Enter your credentials to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input 
                                type="email" 
                                required
                                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                placeholder="name@company.com"
                                onChange={(e) => setLoginUser({ ...loginUser, email: e.target.value })} 
                                value={loginUser.email} 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Password</label>
                            <button type="button" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</button>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input 
                                type="password" 
                                required
                                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                placeholder="••••••••"
                                onChange={(e) => setLoginUser({ ...loginUser, password: e.target.value })} 
                                value={loginUser.password} 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:translate-y-[-1px] active:translate-y-[0px]"
                    >
                        <span>Sign In</span>
                        <LogIn size={18} />
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1">
                            Create account <ArrowRight size={14} />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginCompnent
