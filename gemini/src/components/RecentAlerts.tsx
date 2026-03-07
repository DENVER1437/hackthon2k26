import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, FileText, ChevronRight, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const containerVars = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.4 }
    }
};

const rowVars = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
};

export function RecentAlerts() {
    const { predictions, setCurrentTab, setSelectedContainer } = useAppContext();

    // Default mock data if no predictions
    const topAlerts = [...predictions].sort((a, b) => b.Risk_Score - a.Risk_Score).slice(0, 5);

    return (
        <div className="dashboard-card border-surfaceHighlight/30 mt-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-critical/5 rounded-full blur-[80px] group-hover:bg-critical/10 transition-colors duration-700" />

            <div className="flex justify-between items-center mb-10 relative z-10 p-2">
                <div>
                    <h3 className="text-xl font-black flex items-center gap-3 text-text-main uppercase tracking-tighter">
                        <ShieldAlert size={24} className="text-critical glow-critical" />
                        Critical Vulnerability Feed
                    </h3>
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-1 ml-9 opacity-70">Priority Threat Vectors</p>
                </div>
                <button
                    onClick={() => setCurrentTab('predictions')}
                    className="text-[10px] font-black text-primary hover:text-primaryHighlight flex items-center gap-2 uppercase tracking-widest transition-all bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 hover:scale-105 active:scale-95"
                >
                    Intel Archive <ChevronRight size={14} />
                </button>
            </div>

            <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-surfaceHighlight/30 text-text-muted text-[10px] uppercase font-black tracking-[0.3em]">
                            <th className="pb-6 px-4">Identifier</th>
                            <th className="pb-6 px-4 text-center">Threat Index</th>
                            <th className="pb-6 px-4 text-center">Anomaly</th>
                            <th className="pb-6 px-4 pl-8">AI Synthesis Report</th>
                        </tr>
                    </thead>
                    <motion.tbody variants={containerVars} initial="hidden" animate="show">
                        {topAlerts.map((alert, idx) => (
                            <motion.tr
                                variants={rowVars}
                                key={idx}
                                onClick={() => setSelectedContainer(alert)}
                                className="border-b border-surfaceHighlight/10 hover:bg-surfaceHighlight/10 transition-all group/row cursor-pointer"
                            >
                                <td className="py-6 px-4">
                                    <div className="flex flex-col">
                                        <span className="font-mono font-black text-base text-text-main tracking-widest group-hover/row:text-primary transition-colors">{alert.Container_ID}</span>
                                        <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest opacity-50">Ref: Alpha-{idx + 1}</span>
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <div className="flex items-center justify-center">
                                        <div className="relative flex items-center justify-center w-14 h-14">
                                            <svg className="w-14 h-14 transform -rotate-90">
                                                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-surfaceHighlight/20" />
                                                <motion.circle
                                                    initial={{ strokeDashoffset: 24 * 2 * Math.PI }}
                                                    animate={{ strokeDashoffset: 24 * 2 * Math.PI - (alert.Risk_Score / 100) * 24 * 2 * Math.PI }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent"
                                                    strokeDasharray={24 * 2 * Math.PI}
                                                    className={alert.Risk_Score >= 90 ? 'text-critical' : alert.Risk_Score >= 70 ? 'text-warning' : 'text-success'}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="absolute text-xs font-black text-text-main">{alert.Risk_Score}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-4 text-center">
                                    {alert.Anomaly_Flag === 'Yes' ? (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-critical/10 text-critical border border-critical/20 glow-critical">
                                            <Activity size={12} className="animate-pulse" /> Outlier
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40">Nominal</span>
                                    )}
                                </td>
                                <td className="py-6 px-4 pl-8">
                                    <div className="flex items-start gap-4">
                                        <div
                                            onClick={(e) => { e.stopPropagation(); setSelectedContainer(alert); }}
                                            className="mt-1 p-2 bg-background/50 rounded-lg group-hover/row:bg-primary/20 group-hover/row:text-primary hover:scale-110 active:scale-90 transition-all cursor-pointer shadow-lg items-center justify-center flex"
                                            title="View Details"
                                        >
                                            <FileText size={16} className="opacity-80" />
                                        </div>
                                        <p className="text-xs text-text-muted leading-relaxed font-medium group-hover/row:text-text-main transition-colors italic">
                                            "{alert.Explanation_Summary}"
                                        </p>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </div>
        </div>
    );
}
