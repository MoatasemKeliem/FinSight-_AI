import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
    const { isAuthenticated, hasProfile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-indigo-600" />
                <p className="text-gray-500 font-medium">Verifying authorization...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!hasProfile) {
        return <Navigate to="/onboarding" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;