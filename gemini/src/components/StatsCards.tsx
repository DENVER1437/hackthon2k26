import React from 'react';
import { Package, AlertOctagon, ShieldCheck, Activity, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export interface SummaryItem {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    bg: string;
    glow?: boolean;
    trend?: string;
}

const containerVars = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVars = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
};

export function StatsCards() {
    const { predictions } = useAppContext();

    const summaryData: SummaryItem[] = [
        {
            title: 'Current Batch',
            value: predictions.length.toLocaleString(),
            icon: <Package />,
            color: 'text-primary',
            bg: 'bg-primary/10',
            trend: 'LIVE'
        },
        {
            title: 'Critical High',
            value: predictions.filter(p => p.Risk_Level === 'Critical').length.toLocaleString(),
            icon: <AlertOctagon />,
            color: 'text-critical',
            bg: 'bg-critical/10',
            glow: true,
            trend: 'ACTION'
        },
        {
            title: 'Anomaly Nodes',
            value: predictions.filter(p => p.Anomaly_Flag === 'Yes').length.toLocaleString(),
            icon: <Zap />,
            color: 'text-warning',
            bg: 'bg-warning/10',
            trend: 'DETECTED'
        },
        {
            title: 'Model Confidence',
            value: `${(predictions.reduce((acc, p) => acc + p.Risk_Score, 0) / (predictions.length || 1)).toFixed(1)}%`,
            icon: <Activity />,
            color: 'text-success',
            bg: 'bg-success/10',
            trend: 'CALC'
        },
        {
            title: 'Secure Units',
            value: predictions.filter(p => p.Risk_Level === 'Low').length.toLocaleString(),
            icon: <ShieldCheck />,
            color: 'text-primaryHighlight',
            bg: 'bg-primaryHighlight/10',
            trend: 'CLEAR'
        },
    ];

    return (
        <motion.div
            variants={containerVars}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
            {summaryData.map((item, index) => (
                <motion.div
                    variants={itemVars}
                    key={index}
                    className={`dashboard-card relative overflow-hidden group cursor-pointer border-surfaceHighlight/30 hover:border-primary/40 p-5 ${item.glow ? 'shadow-[0_0_30px_rgba(var(--critical),0.15)] hover:shadow-[0_0_40px_rgba(var(--critical),0.25)]' : ''
                        }`}
                >
                    {/* Background Glow */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${item.bg.replace('/10', '')}`} />

                    <div className="flex flex-col gap-4 relative z-10 text-center md:text-left">
                        <div className="flex justify-between items-start">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${item.bg} ${item.color} ${item.glow ? 'border-critical/30' : 'border-surfaceHighlight/50'}`}>
                                {React.cloneElement(item.icon as React.ReactElement, { size: 24, strokeWidth: 2.5 })}
                            </div>
                            {item.trend && (
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest ${item.glow ? 'bg-critical/10 text-critical border-critical/20' : 'bg-surfaceHighlight/30 text-text-muted border-surfaceHighlight/50'
                                    }`}>
                                    {item.trend}
                                </span>
                            )}
                        </div>

                        <div className="space-y-1">
                            <p className="text-text-muted text-[10px] font-black tracking-[0.2em] uppercase opacity-60 leading-none">
                                {item.title}
                            </p>
                            <h3 className={`text-2xl font-black tracking-tighter leading-none ${item.glow ? 'text-critical' : 'text-text-main'}`}>
                                {item.value}
                            </h3>
                        </div>
                    </div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                </motion.div>
            ))}
        </motion.div>
    );
}
