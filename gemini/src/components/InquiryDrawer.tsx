import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Brain, ShieldAlert, Activity, FileText,
    AlertTriangle, CheckCircle,
    ArrowRight, Radar, Scan, Fingerprint,
    MapPin, Clock, DollarSign, Weight,
    ChevronRight, Zap, LucideIcon
} from 'lucide-react';
import { PredictionRow, useAppContext } from '../context/AppContext';
import {
    Radar as RadarChart,
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts';

interface InquiryDrawerProps {
    container: PredictionRow | null;
    onClose: () => void;
}

export function InquiryDrawer({ container, onClose }: InquiryDrawerProps) {
    const { theme } = useAppContext();
    const [activeTab, setActiveTab] = useState<'profile' | 'analysis'>('profile');

    useEffect(() => {
        if (container) {
            setActiveTab('profile');
        }
    }, [container]);

    if (!container) return null;

    const radarData = [
        { subject: 'Weight', A: container.Risk_Score * 0.8 + 10, fullMark: 100 },
        { subject: 'Value', A: Math.min(100, (container.Declared_Value || 0) / 1000), fullMark: 100 },
        { subject: 'History', A: container.Risk_Level === 'Critical' ? 90 : 40, fullMark: 100 },
        { subject: 'Dwell', A: Math.min(100, (container.Dwell_Time_Hours || 0) * 2), fullMark: 100 },
        { subject: 'Route', A: 65, fullMark: 100 },
    ];

    const chartTextColor = theme === 'dark' ? '#94a3b8' : '#475569';
    const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/60 backdrop-blur-md pointer-events-auto transition-colors"
                />

                {/* Drawer */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="absolute right-0 top-0 h-full w-full md:w-[500px] bg-surface border-l border-surfaceHighlight/50 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] flex flex-col pointer-events-auto transition-colors"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-surfaceHighlight/30 flex justify-between items-center bg-surface/50 backdrop-blur-lg sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${container.Risk_Level === 'Critical' ? 'bg-critical/10 border-critical/30 text-critical glow-critical' : 'bg-primary/10 border-primary/30 text-primary'}`}>
                                <Brain size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-text-main tracking-tighter uppercase leading-none mb-1">AI Inquiry</h2>
                                <p className="text-[10px] text-text-muted font-black tracking-[0.2em] uppercase opacity-70">Unit: {container.Container_ID}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-surfaceHighlight/50 rounded-xl text-text-muted hover:text-text-main transition-all group active:scale-90"
                        >
                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-surfaceHighlight/30 p-2 bg-background/20">
                        {(['profile', 'analysis'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === tab
                                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg'
                                    : 'text-text-muted hover:text-text-main'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {activeTab === 'profile' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                {/* Risk Status Card */}
                                <div className={`p-6 rounded-3xl border relative overflow-hidden group ${container.Risk_Level === 'Critical' ? 'bg-gradient-to-br from-critical/10 to-transparent border-critical/30' : 'bg-gradient-to-br from-primary/10 to-transparent border-primary/30'
                                    }`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Zap size={60} />
                                    </div>
                                    <div className="flex justify-between items-center mb-6 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <ShieldAlert className={container.Risk_Level === 'Critical' ? 'text-critical' : 'text-primary'} size={20} />
                                            <span className="text-xs font-black text-text-main uppercase tracking-widest">Protocol Matrix</span>
                                        </div>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${container.Risk_Level === 'Critical' ? 'bg-critical text-white glow-critical' : 'bg-primary text-white'
                                            }`}>
                                            {container.Risk_Level} PROBABILITY
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end mb-4 relative z-10">
                                        <h3 className={`text-5xl font-black tracking-tighter ${container.Risk_Level === 'Critical' ? 'text-critical' : 'text-primary'}`}>{container.Risk_Score}%</h3>
                                        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-2 opacity-60 italic">Threat Coefficient</p>
                                    </div>
                                    <div className="w-full bg-background/50 h-3 rounded-full overflow-hidden shadow-inner relative z-10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${container.Risk_Score}%` }}
                                            className={`h-full rounded-full ${container.Risk_Level === 'Critical' ? 'bg-critical glow-critical' : 'bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]'}`}
                                        />
                                    </div>
                                </div>

                                {[
                                    { label: 'Weight Signal', val: `${(container.Measured_Weight || 0).toLocaleString()} kg`, icon: Weight },
                                    { label: 'Value Density', val: `$${(container.Declared_Value || 0).toLocaleString()}`, icon: DollarSign },
                                    { label: 'Dwell History', val: `${container.Dwell_Time_Hours} Hours`, icon: Clock },
                                    { label: 'Origin Audit', val: container.Origin_Country, icon: MapPin }
                                ].map((stat, i) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={i} className="p-4 bg-background/40 rounded-2xl border border-surfaceHighlight/40 hover:border-primary/30 transition-colors shadow-sm">
                                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-2 flex items-center gap-2 opacity-60">
                                                <Icon size={14} /> {stat.label}
                                            </p>
                                            <p className="text-text-main font-mono font-black text-sm tracking-tight">{stat.val}</p>
                                        </div>
                                    );
                                })}

                                {/* AI Narrative */}
                                <div className="p-6 bg-background/60 rounded-3xl border border-surfaceHighlight/50 relative group overflow-hidden shadow-xl">
                                    <div className="absolute -bottom-4 -right-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                                        <Scan size={100} />
                                    </div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <Activity size={14} className="animate-pulse" /> Neural Diagnostic Synthesis
                                    </h4>
                                    <p className="text-text-main text-sm leading-relaxed italic font-medium relative z-10">
                                        "{container.Explanation_Summary}"
                                    </p>
                                </div>

                                <button
                                    onClick={() => setActiveTab('analysis')}
                                    className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:brightness-110 shadow-2xl group"
                                >
                                    Deep Vector Analysis <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                                </button>
                            </motion.div>
                        )}

                        {activeTab === 'analysis' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col space-y-10">
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter flex items-center justify-center gap-3">
                                        <Radar size={24} className="text-primary glow-primary" />
                                        Risk Decomposition
                                    </h3>
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">Multivariate Feature Isolation</p>
                                </div>

                                <div className="h-[320px] w-full bg-background/50 rounded-[40px] border border-surfaceHighlight/30 flex items-center justify-center relative shadow-2xl overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                            <PolarGrid stroke={gridColor} />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: chartTextColor, fontSize: 10, fontWeight: 'bold' }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <RadarChart
                                                name="Risk Profile"
                                                dataKey="A"
                                                stroke="rgb(var(--primary))"
                                                fill="rgb(var(--primary))"
                                                fillOpacity={0.4}
                                            />
                                        </RechartsRadarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] pl-2 border-l-2 border-primary">Operational Directives</h4>
                                    {[
                                        { title: 'Tactical Inspection', desc: 'Execute immediate physical scan for mass discrepancies.', icon: Scan, color: 'text-warning', bg: 'bg-warning/10' },
                                        { title: 'Authority Audit', desc: 'Sanctions check and manifest veracity verification.', icon: Fingerprint, color: 'text-primary', bg: 'bg-primary/10' }
                                    ].map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={i} className="flex items-center gap-5 p-5 bg-background/40 rounded-3xl border border-surfaceHighlight/40 hover:border-primary/30 transition-all group cursor-pointer hover:shadow-lg">
                                                <div className={`p-4 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform shadow-sm`}><Icon size={22} /></div>
                                                <div>
                                                    <p className="text-sm font-black text-text-main uppercase tracking-tight">{item.title}</p>
                                                    <p className="text-[11px] text-text-muted font-medium mt-1 leading-tight">{item.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
