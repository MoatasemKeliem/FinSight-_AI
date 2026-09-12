import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { logout } from "../api/auth"
import { useAuth } from "../Context/AuthContext"
import {
    TrendingUp,
    Home,
    Lightbulb,
    LayoutDashboard,
    Settings,
    LogOut,
    LogIn,
    Menu,
    X,
    Moon,
    Sun,
    FileText,
    DollarSign
} from "lucide-react"

const Navbar = () => {
    const { logoutUser, isAuthenticated } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage first
        const saved = localStorage.getItem('theme')
        if (saved) return saved === 'dark'
        // Fallback to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDark])

    const handleLogout = async () => {
        try {
            await logout();
            logoutUser()
        } catch (error) {
            console.error("FAILED TO LOG OUT: ", error)
        }
    }

    const navLinks = [
        { to: "/aiinsight", label: "AI Insight", icon: <Lightbulb size={18} /> },
        { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { to: "/documents", label: "Documents", icon: <FileText size={18} /> },
        { to: "/companyprofile", label: "Settings", icon: <Settings size={18} /> },
    ]

    const loggedOutNavbar = [
        { to: "/", label: "Home", icon: <Home size={18} /> },
        { to: "/pricing", label: "Pricing", icon: <DollarSign size={18} /> },
    ]



    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <NavLink to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                            <TrendingUp size={24} />
                            <span>Finsight AI</span>
                        </NavLink>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-600 dark:text-slate-400"
                                    }`
                                }
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </NavLink>
                        ))) :
                            (loggedOutNavbar.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-gray-600 dark:text-slate-400"
                                        }`
                                    }
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </NavLink>
                            )))
                        }
                    </div>

                    {/* Right Section: Theme & Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-slate-400"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <NavLink
                                to="/login"
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                            >
                                <LogIn size={18} />
                                <span>Login</span>
                            </NavLink>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 text-gray-600 dark:text-slate-400"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 dark:text-slate-400"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                                }`
                            }
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                    <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="flex w-full items-center gap-3 px-3 py-3 text-red-600 dark:text-red-400 font-medium"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <NavLink
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-3 text-indigo-600 dark:text-indigo-400 font-medium"
                            >
                                <LogIn size={18} />
                                <span>Login</span>
                            </NavLink>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
