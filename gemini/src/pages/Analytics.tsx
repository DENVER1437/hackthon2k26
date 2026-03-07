import React, { useMemo, useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Legend,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    ZAxis
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Globe, Activity, DollarSign, TrendingUp, ShieldCheck, Cpu, Database, Zap, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// --- Typewriter Effect Component ---
const Typewriter = ({ text, delay = 15 }: { text: string, delay?: number }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(i));
            i++;
            if (i >= text.length) clearInterval(timer);
        }, delay);
        return () => clearInterval(timer);
    }, [text, delay]);

    return <span>{displayedText}</span>;
};

export function Analytics() {
    const { predictions, theme } = useAppContext();
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [showPlanView, setShowPlanView] = useState(false);

    // 1. Risk Distribution Metrics
    const riskStats = useMemo(() => {
        const counts = { Critical: 0, Medium: 0, Low: 0, Anomaly: 0, Moderate: 0 };
        predictions.forEach(p => {
            if (counts.hasOwnProperty(p.Risk_Level)) {
                counts[p.Risk_Level]++;
            }
        });
        return [
            { name: 'Critical', value: counts.Critical, color: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' },
            { name: 'Moderate', value: counts.Medium, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' },
            { name: 'Low', value: counts.Low, color: '#10b981', glow: 'rgba(16, 185, 129, 0.5)' }
        ];
    }, [predictions]);

    // 2. Origin Geography Metrics 
    const geoStats = useMemo(() => {
        const countries: Record<string, { total: number, critical: number, value: number }> = {};
        predictions.forEach(p => {
            const country = p.Origin_Country || 'Global';
            if (!countries[country]) countries[country] = { total: 0, critical: 0, value: 0 };
            countries[country].total++;
            countries[country].value += (p.Declared_Value || 0);
            if (p.Risk_Level === 'Critical') countries[country].critical++;
        });

        return Object.entries(countries)
            .map(([name, stats]) => ({
                name,
                ...stats,
                density: ((stats.critical / stats.total) * 100).toFixed(1)
            }))
            .sort((a, b) => b.critical - a.critical)
            .slice(0, 5);
    }, [predictions]);

    // 3. Risk vs Value Correlation (Scatter) - Improved Scale
    const scatterData = useMemo(() => {
        return predictions.slice(0, 200).map(p => ({
            value: p.Declared_Value || 0,
            score: p.Risk_Score,
            id: p.Container_ID,
            risk: p.Risk_Level,
            z: p.Anomaly_Flag === 'Yes' ? 500 : 80
        }));
    }, [predictions]);

    // 4. Time Distribution - Granular Hourly if single day
    const timeData = useMemo(() => {
        const slots: Record<string, { critical: number, moderate: number, anomaly: number }> = {};
        const isSingleDay = new Set(predictions.map(p => p.Declaration_Date)).size <= 1;

        predictions.forEach(p => {
            let key = p.Declaration_Date || '2024-03-06';
            if (isSingleDay && p.Declaration_Time) {
                // Group by Hour
                key = p.Declaration_Time.split(':')[0] + ':00';
            }
            if (!slots[key]) slots[key] = { critical: 0, moderate: 0, anomaly: 0 };
            if (p.Risk_Level === 'Critical') slots[key].critical++;
            if (p.Risk_Level === 'Medium') slots[key].moderate++;
            if (p.Anomaly_Flag === 'Yes') slots[key].anomaly++;
        });
        return Object.entries(slots).map(([name, stats]) => ({ name, ...stats })).sort((a, b) => a.name.localeCompare(b.name));
    }, [predictions]);

    const handleGeneratePlan = () => {
        setIsGeneratingPlan(true);
        setTimeout(() => {
            setIsGeneratingPlan(false);
            setShowPlanView(true);
        }, 2500);
    };

    const totalValue = predictions.reduce((acc, p) => acc + (p.Declared_Value || 0), 0);
    const criticalRatio = ((riskStats[0].value / predictions.length) * 100).toFixed(1);

    const chartTextColor = theme === 'dark' ? '#94a3b8' : '#475569';
    const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';

    if (predictions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-text-muted space-y-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center animate-spin-slow">
                        <Database size={40} className="text-primary/40" />
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase">No Intelligence Loaded</h3>
                    <p className="max-w-xs mx-auto text-sm">Upload a manifest to activate top-tier tactical analytics.</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20 mt-4">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
                <div>
                    <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase leading-none mb-2">
                        Tactical <span className="text-primary">Intelligence</span>
                    </h2>
                    <p className="text-text-muted text-sm font-medium tracking-wide flex items-center gap-2 italic">
                        <Activity size={14} className="text-success animate-pulse" />
                        Monitoring {predictions.length.toLocaleString()} active cargo vectors.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
                    {[
                        { label: 'Priority Targets', val: riskStats[0].value, color: 'text-critical' },
                        { label: 'Value Flow', val: `$${(totalValue / 1000000).toFixed(1)}M`, color: 'text-success' },
                        { label: 'Risk Spread', val: `${criticalRatio}%`, color: 'text-warning' },
                        { label: 'Anomalies', val: predictions.filter(p => p.Anomaly_Flag === 'Yes').length, color: 'text-primary' }
                    ].map((m, i) => (
                        <div key={i} className="bg-surface border border-surfaceHighlight rounded-2xl p-4 shadow-lg backdrop-blur-md">
                            <p className="text-[10px] uppercase font-black text-text-muted tracking-widest mb-1">{m.label}</p>
                            <p className={`text-xl font-black ${m.color} tracking-tighter`}>{m.val}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Summary Banner */}
            <div className="dashboard-card border-surfaceHighlight/50 bg-surface/60 backdrop-blur-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-primary/10 group-hover:text-primary/20 transition-colors">
                    <Sparkles size={80} />
                </div>
                <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0 shadow-lg">
                        <Cpu size={32} className="text-primary animate-pulse" />
                    </div>
                    <div className="text-lg md:text-xl font-bold text-text-main leading-relaxed font-mono flex-1">
                        <Typewriter text={`TACTICAL SYNTHESIS: Neural analysis detects a ${(riskStats[0].value / predictions.length * 100).toFixed(1)}% saturation of high-threat vectors. Predictive clustering indicates ${geoStats[0]?.name} accounts for ${geoStats[0]?.density}% of regional risk density. The Risk-Value Correlation confirms that cargo valued over $500k exhibits a ${(predictions.filter(p => (p.Declared_Value || 0) > 500000 && p.Risk_Level === 'Critical').length / Math.max(1, predictions.filter(p => (p.Declared_Value || 0) > 500000).length) * 100).toFixed(1)}% critical flag rate. STRATEGIC PROTOCOL: Priority physical inspection required for Alpha-Tier targets immediately.`} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Risk-Value Scatter Chart */}
                <div className="dashboard-card p-6 h-[500px] flex flex-col border-surfaceHighlight">
                    <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Zap size={16} className="text-warning" /> Risk-Value Correlation Matrix
                    </h3>
                    <div className="flex-1 overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} strokeOpacity={0.1} />
                                <XAxis
                                    type="number"
                                    dataKey="value"
                                    stroke={chartTextColor}
                                    tick={{ fontSize: 10, fontWeight: 'bold' }}
                                    domain={[0, 'auto']}
                                    tickFormatter={(val) => {
                                        if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
                                        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
                                        if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
                                        return `$${val}`;
                                    }}
                                    label={{ value: 'Cargo Valuation (USD)', position: 'bottom', offset: 20, fill: chartTextColor, fontSize: 10, fontWeight: 'black', textAnchor: 'middle' }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="score"
                                    stroke={chartTextColor}
                                    tick={{ fontSize: 10, fontWeight: 'bold' }}
                                    domain={[0, 100]}
                                    label={{ value: 'Threat Index (0-100)', angle: -90, position: 'insideLeft', fill: chartTextColor, fontSize: 10, fontWeight: 'black', dx: 10 }}
                                />
                                <ZAxis type="number" dataKey="z" range={[80, 500]} />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3', stroke: 'rgba(59, 130, 246, 0.5)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-surface/90 backdrop-blur-xl border border-surfaceHighlight p-4 rounded-2xl shadow-2xl min-w-[200px]">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Unit ID</p>
                                                        <p className="font-mono text-sm font-black text-text-main">{data.id}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between border-t border-surfaceHighlight/30 pt-2">
                                                            <span className="text-xs text-text-muted">Valuation</span>
                                                            <span className="text-xs font-bold text-text-main">${data.value.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between border-t border-surfaceHighlight/30 pt-2">
                                                            <span className="text-xs text-text-muted">Threat Index</span>
                                                            <span className={`text-xs font-black ${data.score >= 90 ? 'text-critical' : data.score >= 70 ? 'text-warning' : 'text-primary'}`}>{data.score}</span>
                                                        </div>
                                                        <div className="flex justify-between border-t border-surfaceHighlight/30 pt-2">
                                                            <span className="text-xs text-text-muted">Security Tier</span>
                                                            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-surfaceHighlight/50 text-text-main">{data.risk}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Scatter name="Units" data={scatterData}>
                                    {scatterData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.risk === 'Critical' ? '#ef4444' : entry.risk === 'Medium' ? '#f59e0b' : '#3b82f6'}
                                            fillOpacity={0.7}
                                            stroke={entry.risk === 'Critical' ? '#ef4444' : entry.risk === 'Medium' ? '#f59e0b' : '#3b82f6'}
                                            strokeWidth={1}
                                            className="drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]"
                                        />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tactical Flux Area Chart */}
                <div className="dashboard-card p-6 h-[500px] flex flex-col border-surfaceHighlight">
                    <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-critical" /> Neural Threat Stream
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeData}>
                                <defs>
                                    <linearGradient id="colorCrit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke={chartTextColor} tick={{ fontSize: 10 }} />
                                <YAxis stroke={chartTextColor} tick={{ fontSize: 10 }} />
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgb(var(--surface))', border: '1px solid rgb(var(--surface-highlight))', borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#colorCrit)" strokeWidth={3} />
                                <Area type="monotone" dataKey="anomaly" stroke="#3b82f6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Geo Vulnerability */}
                <div className="dashboard-card p-6 h-[400px] border-surfaceHighlight">
                    <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-8 flex items-center gap-2">
                        <Globe size={16} className="text-success" /> Regional Risk Density
                    </h3>
                    <div className="space-y-6">
                        {geoStats.map((source, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-bold text-text-main">{source.name}</span>
                                    <span className="text-[10px] font-black text-critical">{source.density}% DENSITY</span>
                                </div>
                                <div className="h-2 w-full bg-surfaceHighlight rounded-full overflow-hidden flex">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${source.density}%` }} className="h-full bg-critical shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Allocation Matrix */}
                <div className="dashboard-card p-6 h-[400px] border-surfaceHighlight">
                    <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-8 flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary" /> Risk Portfolio
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={riskStats} innerRadius={70} outerRadius={90} paddingAngle={10} dataKey="value" stroke="none">
                                    {riskStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgb(var(--surface))', border: '1px solid rgb(var(--surface-highlight))', borderRadius: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="text-center mt-4">
                            <p className="text-2xl font-black text-text-main">{predictions.length}</p>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Total Monitored Units</p>
                        </div>
                    </div>
                </div>

                {/* Inspection Priority & Action Plan */}
                <div className="dashboard-card p-6 h-[400px] flex flex-col justify-between border-primary/20 bg-gradient-to-br from-surface to-primary/5">
                    <div>
                        <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-8 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-primary" /> Strategy Deployment
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-background/50 rounded-xl border border-surfaceHighlight/30">
                                <span className="text-xs text-text-muted font-bold">ALPHA (Critical)</span>
                                <span className="text-sm font-black text-critical">{riskStats[0].value}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-background/50 rounded-xl border border-surfaceHighlight/30">
                                <span className="text-xs text-text-muted font-bold">BETA (Moderate)</span>
                                <span className="text-sm font-black text-warning">{riskStats[1].value}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGeneratePlan}
                        disabled={isGeneratingPlan}
                        className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl relative overflow-hidden flex items-center justify-center gap-3 ${isGeneratingPlan ? 'bg-surfaceHighlight text-text-muted' : 'bg-primary text-white hover:brightness-110 hover:scale-[1.02]'
                            }`}
                    >
                        {isGeneratingPlan ? (
                            <div className="flex items-center gap-2">
                                <Activity size={16} className="animate-spin" />
                                Calculating Plan...
                            </div>
                        ) : (
                            <>
                                <FileText size={16} /> Generate Action Plan
                            </>
                        )}
                        <AnimatePresence>
                            {isGeneratingPlan && (
                                <motion.div
                                    className="absolute inset-0 bg-primary/20"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Action Plan Modal Overlay */}
                    <AnimatePresence>
                        {showPlanView && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-md"
                                onClick={() => setShowPlanView(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                    className="bg-surface border border-surfaceHighlight w-full max-w-lg rounded-3xl p-8 shadow-[0_0_100px_rgba(var(--primary),0.3)]"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center border border-success/30">
                                            <CheckCircle2 size={24} className="text-success" />
                                        </div>
                                        <h4 className="text-2xl font-black text-text-main uppercase tracking-tighter">Plan Generated</h4>
                                    </div>
                                    <div className="space-y-4 mb-8">
                                        <p className="text-text-muted text-sm leading-relaxed">
                                            Tactical Action Plan **ST-77** has been finalized and transmitted to the ground units.
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-sm text-text-main">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                Priority 1: Immediate physical scan for all {riskStats[0].value} Alpha units.
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-text-main">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                Priority 2: Document audit for Beta clusters from {geoStats[0]?.name}.
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowPlanView(false)}
                                        className="w-full py-4 bg-surfaceHighlight text-text-main rounded-2xl font-bold hover:brightness-125 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <style>{`
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 12s linear infinite; }
            `}</style>
        </motion.div>
    );
}
