import { createContext, useContext, useEffect, useState } from "react";
import { check } from "../api/auth";
import { GetAllCompanyProfiles } from "../api/companyProfile";

const AuthContext = createContext({ 
    isAuthenticated: false, 
    hasProfile: false,
    loading: true, 
    checkStatus: () => { }, 
    logoutUser: () => { } 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkStatus = async () => {
        try {
            await check();
            setIsAuthenticated(true);
            
            // After auth check, check if company profile exists
            const profiles = await GetAllCompanyProfiles();
            setHasProfile(profiles && profiles.length > 0);
        } catch {
            setIsAuthenticated(false);
            setHasProfile(false);
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = () => {
        setIsAuthenticated(false)
        setHasProfile(false)
    }

    useEffect(() => { checkStatus(); }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, hasProfile, loading, checkStatus, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);