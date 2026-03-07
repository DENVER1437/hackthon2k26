import React from 'react';
import { StatsCards } from '../components/StatsCards';
import { ChartsPanel } from '../components/ChartsPanel';
import { RecentAlerts } from '../components/RecentAlerts';
import { motion } from 'framer-motion';
import { Activity, Database } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Dashboard() {
    const { predictions, setCurrentTab } = useAppContext();

    const handleInitialize = () => {
        alert("Please enter database first");
        setCurrentTab('upload');
    };

    if (predictions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8"
            >
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                        <Database size={48} className="text-primary/30" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity size={24} className="text-primary animate-pulse" />
                    </div>
                </div>
                <div className="space-y-4 max-w-md">
                    <h2 className="text-3xl font-black text-text-main uppercase tracking-tighter">No Intelligence Assets Detected</h2>
                    <p className="text-text-muted font-medium text-sm leading-relaxed">
                        The neural risk engine is currently in standby. Upload a container manifest dataset to begin real-time tactical analysis and threat detection.
                    </p>
                </div>
                <button
                    onClick={handleInitialize}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 group"
                >
                    Initialize Data Ingestion
                    <Activity size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 pb-12"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <h2 className="text-4xl font-black text-text-main uppercase tracking-tighter leading-none mb-2">Tactical <span className="text-primary">Overview</span></h2>
                    <p className="text-text-muted font-bold text-sm uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Activity size={14} className="text-success animate-pulse" />
                        Real-time Neural Risk Assessment Protocol
                    </p>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted bg-surface/50 border border-surfaceHighlight/30 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    LAST SYNC: JUST NOW
                </div>
            </div>

            {/* Extracted Components */}
            <StatsCards />
            <ChartsPanel />
            <RecentAlerts />
        </motion.div>
    );
}
