import Navbar from "./Navbar"
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50 transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            <footer className="py-8 text-center text-sm text-gray-500 dark:text-slate-400 border-t border-gray-200 dark:border-slate-800 mt-auto">
                <div className="max-w-7xl mx-auto px-4">
                    © {new Date().getFullYear()} Finsight AI. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

export default Layout
