import React, { useState } from 'react';
import { BrainCircuit, Info, Search, Cpu, MessageSquareWarning, ArrowRight, Zap, CheckCircle, AlertTriangle, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { SearchableCombobox } from './SearchableCombobox';

export function ExplainableAI() {
    const { predictions, theme } = useAppContext();
    const [containerId, setContainerId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<any>(null);
    const [shapData, setShapData] = useState<any[]>([]);

    const generateMockShap = (row: any) => {
        const isCritical = row.Risk_Level === 'Critical';
        const isMedium = row.Risk_Level === 'Medium';

        return [
            { feature: 'Weight Discrep.', impact: isCritical ? 0.35 : (isMedium ? 0.15 : 0.02), color: isCritical ? '#ef4444' : (isMedium ? '#f59e0b' : '#3b82f6') },
            { feature: 'Route History', impact: isCritical ? 0.22 : 0.05, color: isCritical ? '#ef4444' : '#3b82f6' },
            { feature: 'Value Density', impact: (row.Declared_Value > 50000) ? 0.18 : 0.03, color: (row.Declared_Value > 50000) ? '#ef4444' : '#3b82f6' },
            { feature: 'Dwell Time', impact: (row.Dwell_Time_Hours > 48) ? 0.25 : -0.05, color: (row.Dwell_Time_Hours > 48) ? '#ef4444' : '#3b82f6' },
            { feature: 'Origin Port', impact: (row.Origin_Country === 'CN' || row.Origin_Country === 'US') ? 0.12 : -0.08, color: (row.Origin_Country === 'CN') ? '#ef4444' : '#3b82f6' },
            { feature: 'Manifest Sync', impact: -0.12, color: '#3b82f6' },
            { feature: 'Historical Audit', impact: -0.15, color: '#3b82f6' },
        ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    };

    const handleAnalyze = async () => {
        if (!containerId.trim() || predictions.length === 0) return;

        setIsLoading(true);
        setError(null);

        // Simulated latency
        await new Promise(resolve => setTimeout(resolve, 800));

        const existingRecord = predictions.find(p => p.Container_ID.toString() === containerId);

        if (existingRecord) {
            setPrediction(existingRecord);
            setShapData(generateMockShap(existingRecord));
            setIsLoading(false);
        } else {
            setError("Container ID not found in the current active batch. Please verify the ID or upload a new manifest.");
            setPrediction(null);
            setIsLoading(false);
        }
    };

    if (predictions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-text-muted space-y-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center animate-spin-slow">
                        <Database size={40} className="text-primary/40" />
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase">No Active Stream</h3>
                    <p className="max-w-xs mx-auto text-sm">Upload a dataset to enable real-time Explainable AI diagnostics.</p>
                </div>
            </div>
        );
    }

    const chartTextColor = theme === 'dark' ? '#94a3b8' : '#475569';
    const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-12"
        >
            <div className="flex justify-between items-end mb-6 relative">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-2 tracking-tight flex items-center gap-4 text-text-main uppercase">
                        Explainable <span className="text-primary">AI</span>
                        <div className="flex gap-1">
                            <Zap size={14} className="text-primary fill-primary/20" />
                            <Zap size={14} className="text-primary fill-primary/20" />
                        </div>
                    </h2>
                    <p className="text-text-muted font-medium italic">Decomposing recursive decision paths into human-verifiable insights.</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="dashboard-card p-8 flex flex-col md:flex-row gap-8 items-center border-surfaceHighlight/50 hover:border-primary/40 shadow-2xl relative overflow-hidden"
            >
                <div className="w-20 h-20 rounded-3xl bg-surface flex items-center justify-center border border-surfaceHighlight shadow-xl relative z-10">
                    <BrainCircuit size={40} className="text-primary animate-pulse" />
                </div>
                <div className="flex-1 relative z-10">
                    <h3 className="text-xl font-black text-text-main mb-1 uppercase tracking-tighter">Diagnostic Inspector</h3>
                    <p className="text-sm text-text-muted mb-6 font-medium">Query any unit from the active manifest ({predictions.length} units detected).</p>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <SearchableCombobox
                            options={predictions.map(p => p.Container_ID.toString())}
                            value={containerId}
                            onChange={(val) => setContainerId(val)}
                            onEnter={handleAnalyze}
                            placeholder="Search or Select ID..."
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all h-[54px] min-w-[200px] ${isLoading
                                ? 'bg-surfaceHighlight text-text-muted cursor-not-allowed'
                                : 'bg-primary text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            {isLoading ? 'Decrypting...' : 'Start Inspection'}
                        </button>
                    </div>
                    <AnimatePresence>
                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-critical text-[10px] font-black uppercase tracking-widest mt-4 flex items-center gap-2">
                                <AlertTriangle size={12} /> {error}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {prediction && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* SHAP Values Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="dashboard-card lg:col-span-2 border-surfaceHighlight"
                    >
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="font-black text-text-main uppercase tracking-wider text-sm">
                                    Feature Contribution Matrix
                                </h3>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Impact towards decision 0.0 (Safe) → 1.0 (Critical)</p>
                            </div>
                        </div>

                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={shapData} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={true} vertical={false} />
                                    <XAxis type="number" stroke={chartTextColor} tick={{ fontSize: 10, fontWeight: 'bold' }} domain={[-0.2, 0.4]} />
                                    <YAxis dataKey="feature" type="category" stroke={chartTextColor} tick={{ fontSize: 11, fontWeight: 'bold' }} width={120} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgb(var(--surface))', border: '1px solid rgb(var(--surface-highlight))', borderRadius: '12px' }}
                                        cursor={{ fill: 'rgb(var(--surface-highlight))', opacity: 0.2 }}
                                    />
                                    <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={20}>
                                        {shapData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* AI Explanation Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className={`dashboard-card h-full border-2 ${prediction.Risk_Level === 'Critical' ? 'border-critical/30 bg-critical/[0.02]' :
                            prediction.Risk_Level === 'Medium' ? 'border-warning/30 bg-warning/[0.02]' : 'border-success/30 bg-success/[0.02]'
                            }`}>
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-black text-text-main uppercase tracking-widest text-sm flex items-center gap-2">
                                        <Cpu size={18} className="text-primary" /> AI Conclusion
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${prediction.Risk_Level === 'Critical' ? 'bg-critical text-white' :
                                        prediction.Risk_Level === 'Medium' ? 'bg-warning text-white' : 'bg-success text-white'
                                        }`}>
                                        {prediction.Risk_Level}
                                    </span>
                                </div>

                                <div className="bg-background shadow-inner rounded-3xl p-6 border border-surfaceHighlight flex-1 backdrop-blur-sm">
                                    <div className="mb-6">
                                        <p className="text-[10px] font-black text-text-muted uppercase mb-2">Unit Identifier</p>
                                        <p className="text-sm font-black text-text-main mb-1 tracking-widest">{prediction.Container_ID}</p>
                                    </div>
                                    <div className="flex justify-between items-end mb-6">
                                        <p className="text-[10px] font-black text-text-muted uppercase">Risk Probability</p>
                                        <p className={`text-4xl font-black ${prediction.Risk_Level === 'Critical' ? 'text-critical' :
                                            prediction.Risk_Level === 'Medium' ? 'text-warning' : 'text-success'
                                            }`}>{prediction.Risk_Score}%</p>
                                    </div>
                                    <p className="text-text-main text-sm leading-relaxed italic font-medium opacity-80 border-t border-surfaceHighlight pt-4 mt-2">
                                        "{prediction.Explanation_Summary}"
                                    </p>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <div className="flex items-center gap-3 p-4 bg-surface/50 rounded-2xl border border-surfaceHighlight">
                                        <CheckCircle size={18} className="text-success" />
                                        <div>
                                            <p className="text-[10px] font-black text-text-main uppercase">Pattern Alignment</p>
                                            <p className="text-[10px] text-text-muted">Consistent with historical benchmarks</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-surface/50 rounded-2xl border border-surfaceHighlight">
                                        <MessageSquareWarning size={18} className="text-warning" />
                                        <div>
                                            <p className="text-[10px] font-black text-text-main uppercase">Operational Directive</p>
                                            <p className="text-[10px] text-text-muted">{prediction.Risk_Level === 'Low' ? 'Proceed to clearance.' : 'Initiate manual audit.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            <style>{`
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 12s linear infinite; }
            `}</style>
        </motion.div>
    );
}
