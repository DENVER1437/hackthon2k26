import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// The shape of the prediction data returned by our FastAPI backend
export interface PredictionRow {
    Container_ID: string;
    Risk_Score: number;
    Risk_Level: 'Critical' | 'Medium' | 'Low' | 'Anomaly' | 'Moderate';
    Anomaly_Flag?: 'Yes' | 'No';
    Explanation_Summary: string;
    Origin_Country?: string;
    Declared_Value?: number;
    Declaration_Date?: string;
    Declaration_Time?: string;
    Declared_Weight?: number;
    Measured_Weight?: number;
    Dwell_Time_Hours?: number;
}

export type Subpage = 'dashboard' | 'upload' | 'predictions' | 'analytics' | 'explainable' | 'architecture';

interface AppContextType {
    predictions: PredictionRow[];
    setPredictions: (predictions: PredictionRow[]) => void;
    selectedContainer: PredictionRow | null;
    setSelectedContainer: (container: PredictionRow | null) => void;
    globalSearch: string;
    setGlobalSearch: (term: string) => void;
    currentTab: Subpage;
    setCurrentTab: (tab: Subpage) => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    isAuthenticated: boolean;
    user: { name: string; role: string } | null;
    login: (email: string, password: string) => { success: boolean; message: string };
    register: (name: string, email: string, password: string) => { success: boolean; message: string };
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [predictions, setPredictions] = useState<PredictionRow[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<PredictionRow | null>(null);
    const [globalSearch, setGlobalSearch] = useState('');
    const [currentTab, setCurrentTab] = useState<Subpage>('dashboard');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

    const login = (email: string, password: string) => {
        // Validation: @gmail.com check
        if (!email.toLowerCase().endsWith('@gmail.com')) {
            return { success: false, message: "Security Violation: Only @gmail.com addresses are authorized." };
        }

        // Validation: Password length check (5-16)
        if (password.length < 5 || password.length > 16) {
            return { success: false, message: "Protocol Error: Password must be between 5 and 16 characters." };
        }

        const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
            setIsAuthenticated(true);
            setUser({ name: foundUser.name, role: 'Regional Analyst' });
            return { success: true, message: "Decryption successful. Session initiated." };
        }
        return { success: false, message: "Invalid credentials. Protocol rejected." };
    };

    const register = (name: string, email: string, password: string) => {
        // Validation: @gmail.com check
        if (!email.toLowerCase().endsWith('@gmail.com')) {
            return { success: false, message: "Registry Error: Only @gmail.com domain is valid for assets." };
        }

        // Validation: Password length check (5-16)
        if (password.length < 5 || password.length > 16) {
            return { success: false, message: "Compliance Error: Identity keys must be 5-16 characters." };
        }

        const exists = registeredUsers.find(u => u.email === email);
        if (exists) {
            return { success: false, message: "Identity collision: User already exists in registry." };
        }
        setRegisteredUsers(prev => [...prev, { name, email, password }]);
        return { success: true, message: "Registration successful. Please initiate a fresh session." };
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setCurrentTab('dashboard');
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    return (
        <AppContext.Provider value={{
            predictions,
            setPredictions,
            selectedContainer,
            setSelectedContainer,
            globalSearch,
            setGlobalSearch,
            currentTab,
            setCurrentTab,
            theme,
            toggleTheme,
            isAuthenticated,
            user,
            login,
            register,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
