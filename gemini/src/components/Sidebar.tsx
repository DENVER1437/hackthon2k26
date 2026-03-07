import React from 'react';
import {
    BarChart3,
    Upload,
    AlertTriangle,
    LineChart,
    BrainCircuit,
    Network,
    Sun,
    Moon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export type Subpage = 'dashboard' | 'upload' | 'predictions' | 'analytics' | 'explainable' | 'architecture';

interface SidebarProps {
    currentTab: Subpage;
    setCurrentTab: (tab: Subpage) => void;
}

const navItems: { id: Subpage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'upload', label: 'Upload Dataset', icon: <Upload size={20} /> },
    { id: 'predictions', label: 'Risk Predictions', icon: <AlertTriangle size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <LineChart size={20} /> },
    { id: 'explainable', label: 'Explainable AI', icon: <BrainCircuit size={20} /> },
    { id: 'architecture', label: 'System Architecture', icon: <Network size={20} /> },
];

export function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
    const { predictions, theme, toggleTheme } = useAppContext();
    const criticalCount = predictions.filter(p => p.Risk_Level === 'Critical').length;

    return (
        <div className="w-64 h-screen bg-surface border-r border-surfaceHighlight/50 flex flex-col fixed left-0 top-0 z-40 transition-colors duration-300 print:hidden">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-text-main tracking-tighter leading-none mb-1 uppercase">SmartContainer</h1>
                        <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Risk Engine</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentTab(item.id)}
                        className={twMerge(
                            'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden',
                            currentTab === item.id
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-text-muted hover:bg-surfaceHighlight/30 hover:text-text-main'
                        )}
                    >
                        {currentTab === item.id && (
                            <motion.div layoutId="activeNav" className="absolute inset-0 bg-primary/5 -z-10" />
                        )}
                        <span className={twMerge(
                            'transition-transform duration-300 group-hover:scale-110',
                            currentTab === item.id ? 'text-primary' : 'text-text-muted group-hover:text-primary'
                        )}>
                            {item.icon}
                        </span>
                        <span className="text-sm font-bold uppercase tracking-widest leading-none">
                            {item.label}
                        </span>

                        {item.id === 'predictions' && criticalCount > 0 && (
                            <span className="ml-auto bg-critical text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse shadow-lg shadow-critical/20">
                                {criticalCount}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 space-y-3">
                <button
                    onClick={toggleTheme}
                    className="w-full h-12 bg-background/50 hover:bg-surfaceHighlight border border-surfaceHighlight/50 rounded-xl px-4 flex items-center justify-between transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                        </div>
                        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{theme === 'dark' ? 'Dark Protocol' : 'Light Mode'}</span>
                    </div>
                    <div className={twMerge('w-8 h-4 rounded-full relative transition-colors duration-300', theme === 'dark' ? 'bg-primary/20' : 'bg-success/20')}>
                        <motion.div
                            animate={{ x: theme === 'dark' ? 16 : 0 }}
                            className={twMerge('absolute top-1 left-1 w-2 h-2 rounded-full', theme === 'dark' ? 'bg-primary' : 'bg-success')}
                        />
                    </div>
                </button>

                <div className="bg-background/50 p-4 rounded-xl border border-surfaceHighlight/30">
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1 opacity-60">System Status</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                        <span className="text-xs font-black text-text-main opacity-80 tracking-widest uppercase">AI MODEL ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ShieldCheck({ size, className }: { size: number, className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    );
}
