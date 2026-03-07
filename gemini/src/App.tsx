import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { PredictionsTable } from './pages/PredictionsTable';
import { Analytics } from './pages/Analytics';
import { ExplainableAI } from './components/ExplainableAI';
import { Architecture } from './components/Architecture';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, User, LogOut, ShieldAlert, Zap } from 'lucide-react';

import { useAppContext, Subpage, PredictionRow } from './context/AppContext';
import { InquiryDrawer } from './components/InquiryDrawer';
import { Login } from './pages/Login';

export default function App() {
    const {
        predictions,
        globalSearch,
        setGlobalSearch,
        selectedContainer,
        setSelectedContainer,
        currentTab,
        setCurrentTab,
        isAuthenticated,
        user,
        logout
    } = useAppContext();

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const match = predictions.find(p =>
                p.Container_ID.toString().toLowerCase() === globalSearch.toLowerCase()
            );
            if (match) {
                setSelectedContainer(match);
            }
        }
    };

    if (!isAuthenticated) {
        return <Login />;
    }

    const criticalAlerts = predictions.filter(p => p.Risk_Level === 'Critical').slice(0, 3);

    const renderContent = () => {
        switch (currentTab) {
            case 'upload': return <Upload onUploadSuccess={() => setCurrentTab('dashboard')} />;
            case 'dashboard': return <Dashboard />;
            case 'predictions': return <PredictionsTable />;
            case 'analytics': return <Analytics />;
            case 'explainable': return <ExplainableAI />;
            case 'architecture': return <Architecture />;
            default: return <div className="text-text-muted p-8 border border-dashed border-surfaceHighlight/50 rounded-xl uppercase font-black text-[10px] tracking-widest">Node status: Offline / Encryption Error</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-text-main overflow-hidden transition-colors duration-300">
            {/* Sidebar Navigation */}
            <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

            {/* Main Content Area */}
            <div className="ml-64 flex-1 flex flex-col h-screen relative print:ml-0">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 print:hidden" />

                {/* Top Header */}
                <header className="h-20 px-8 flex items-center justify-between border-b border-surfaceHighlight/30 bg-surface/50 backdrop-blur-md z-40 sticky top-0 print:hidden">
                    <div className="relative group">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" />
                        <input
                            type="text"
                            placeholder="Universal search: Container ID... (Press Enter)"
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            className="bg-background/50 border border-surfaceHighlight/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 w-80 transition-all duration-300 placeholder:text-text-muted/50"
                        />
                    </div>

                    <div className="flex items-center gap-6 relative">
                        {/* Notifications Bell */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                                className={`relative text-text-muted hover:text-primary transition-all p-2 rounded-lg hover:bg-primary/10 ${showNotifications ? 'bg-primary/10 text-primary' : ''}`}
                            >
                                <Bell size={20} />
                                {criticalAlerts.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-critical rounded-full border-2 border-surface shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-80 bg-surface/90 backdrop-blur-2xl border border-surfaceHighlight/50 rounded-3xl shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="p-5 border-b border-surfaceHighlight/30 flex justify-between items-center">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main">Tactical Alerts</h4>
                                            <span className="bg-critical/10 text-critical text-[9px] font-black px-2 py-0.5 rounded-full border border-critical/20">{criticalAlerts.length} Critical</span>
                                        </div>
                                        <div className="p-2 max-h-[400px] overflow-y-auto">
                                            {criticalAlerts.length > 0 ? (
                                                criticalAlerts.map(alert => (
                                                    <button
                                                        key={alert.Container_ID}
                                                        onClick={() => { setSelectedContainer(alert); setShowNotifications(false); }}
                                                        className="w-full text-left p-4 hover:bg-surfaceHighlight/20 rounded-2xl mb-1 transition-all group border border-transparent hover:border-surfaceHighlight/30"
                                                    >
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <div className="p-1.5 bg-critical/10 rounded-lg text-critical">
                                                                <ShieldAlert size={14} />
                                                            </div>
                                                            <span className="font-mono text-xs font-black text-text-main tracking-widest">{alert.Container_ID}</span>
                                                        </div>
                                                        <p className="text-[10px] text-text-muted font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
                                                            {alert.Explanation_Summary}
                                                        </p>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <Zap size={24} className="text-text-muted mx-auto mb-2 opacity-20" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Sector Nominal</p>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => { setCurrentTab('predictions'); setShowNotifications(false); }}
                                            className="w-full p-4 text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/5 transition-all border-t border-surfaceHighlight/20"
                                        >
                                            View All Threat Intelligence
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-4 pl-6 border-l border-surfaceHighlight/30 relative">
                            <div className="text-right flex-col hidden sm:flex">
                                <span className="text-sm font-black uppercase tracking-tighter leading-none mb-1">{user?.name}</span>
                                <span className="text-[10px] font-black text-primary tracking-widest uppercase opacity-80">{user?.role}</span>
                            </div>
                            <button
                                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                                className={`w-10 h-10 rounded-xl bg-surface border flex items-center justify-center relative overflow-hidden group transition-all shadow-lg ${showUserMenu ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'border-surfaceHighlight/50 hover:border-primary/50'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 opacity-50 transition-opacity"></div>
                                <User size={18} className="text-text-main relative z-10" />
                            </button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-14 w-60 bg-surface/90 backdrop-blur-2xl border border-surfaceHighlight/50 rounded-3xl shadow-2xl overflow-hidden z-50 p-2"
                                    >
                                        <div className="p-4 mb-2">
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Logged in as</p>
                                            <p className="text-sm font-black text-text-main uppercase">{user?.name}</p>
                                            <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-text-muted opacity-50">
                                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                                                Last Sync: Just Now
                                            </div>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-critical/5 text-critical hover:bg-critical/10 transition-all font-black uppercase text-[10px] tracking-widest border border-critical/10"
                                        >
                                            <LogOut size={14} /> Disconnect Session
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-8 relative z-20 custom-scrollbar">
                    <div className="max-w-7xl mx-auto pb-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Global Inquiry Drawer */}
            <InquiryDrawer
                container={selectedContainer}
                onClose={() => setSelectedContainer(null)}
            />
        </div>
    );
}
