import React from 'react';
import { Database, Filter, Cpu, Target, LayoutDashboard, Zap, Activity, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const pipelineSteps = [
    { id: 'data', title: 'Intelligence Ingestion', desc: 'Raw manifest streams & vector data', icon: <Database size={24} />, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
    { id: 'prep', title: 'Signal Optimization', desc: 'Noise reduction & feature scaling', icon: <Filter size={24} />, color: 'text-success', bg: 'bg-success/10 border-success/20' },
    { id: 'feat', title: 'Vector Extraction', desc: 'Isolating 50+ multivariate dimensions', icon: <Cpu size={24} />, color: 'text-primaryHighlight', bg: 'bg-primaryHighlight/10 border-primaryHighlight/20' },
    { id: 'model', title: 'Neural Classification', desc: 'Ensemble risk scoring algorithms', icon: <Target size={24} />, color: 'text-critical', bg: 'bg-critical/10 border-critical/20' },
    { id: 'out', title: 'Visual Intelligence', desc: 'Tactical dashboard & XAI output', icon: <LayoutDashboard size={24} />, color: 'text-success', bg: 'bg-success/10 border-success/20' },
];

export function Architecture() {
    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="relative">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                        <Activity size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-text-main uppercase tracking-tighter leading-none">System <span className="text-primary">Architecture</span></h2>
                        <p className="text-text-muted font-bold text-xs uppercase tracking-[0.3em] opacity-60 mt-1">Advanced Neural Risk Orchestration Blueprint</p>
                    </div>
                </div>
            </div>

            {/* Main Flow Stage */}
            <div className="dashboard-card border-surfaceHighlight/30 bg-surface/30 p-12 relative overflow-hidden group min-h-[300px] flex items-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 z-10 w-full">
                    {pipelineSteps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, type: 'spring' }}
                            className="flex flex-col items-center flex-1 w-full text-center group/node"
                        >
                            <div className="relative mb-6">
                                <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center shadow-2xl border transition-all duration-500 relative ${step.bg}`}>
                                    <div className={`relative z-10 ${step.color}`}>
                                        {React.cloneElement(step.icon as React.ReactElement, { size: 32, strokeWidth: 2.5 })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-40">Phase 0{index + 1}</h3>
                                <h4 className="text-sm font-black text-text-main uppercase tracking-tight">{step.title}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* In-Depth Tech Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="dashboard-card border-surfaceHighlight/20 bg-background/40 hover:border-primary/30 group"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                            <Target size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-text-main uppercase tracking-tighter">Supervised Logic Gate</h3>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60 leading-none mt-1">Optimized Random Forest Matrix</p>
                        </div>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed mb-8 font-medium">
                        The core predictive engine utilizing a 200-tree ensemble matrix. Each node executes independent data split operations based on Gini Impurity reduction, isolating high-likelihood contraband vectors across 50+ weighted feature dimensions.
                    </p>
                    <div className="space-y-3">
                        {[
                            { label: 'Precision Rating', val: '98.4%', icon: <Info size={12} /> },
                            { label: 'Decision Latency', val: '< 12ms', icon: <Info size={12} /> },
                            { label: 'Complexity', val: 'O(M*N*logN)', icon: <Info size={12} /> }
                        ].map((spec, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-surface/50 rounded-2xl border border-surfaceHighlight/10 text-[10px] font-black uppercase tracking-widest">
                                <span className="text-text-muted flex items-center gap-2">{spec.icon} {spec.label}</span>
                                <span className="text-text-main">{spec.val}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="dashboard-card border-surfaceHighlight/20 bg-background/40 hover:border-warning/30 group"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-warning/10 rounded-2xl text-warning border border-warning/20 group-hover:scale-110 transition-transform">
                            <Zap size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-text-main uppercase tracking-tighter">Anomalous Outlier Engine</h3>
                            <p className="text-[10px] text-warning font-black uppercase tracking-widest opacity-60 leading-none mt-1">Zero-Day Isolation Forest</p>
                        </div>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed mb-8 font-medium">
                        A specialized unsupervised isolation matrix designed to detect "Black Swan" events. By recursively isolating sparse data clusters, the system flags behavioral anomalies that subvert traditional rule-based classification models.
                    </p>
                    <div className="space-y-3">
                        {[
                            { label: 'Detection Rate', val: '94.2%', icon: <Info size={12} /> },
                            { label: 'Feature Space', val: 'Infinite', icon: <Info size={12} /> },
                            { label: 'Self-Learning', val: 'ENABLED', icon: <Info size={12} /> }
                        ].map((spec, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-surface/50 rounded-2xl border border-surfaceHighlight/10 text-[10px] font-black uppercase tracking-widest">
                                <span className="text-text-muted flex items-center gap-2">{spec.icon} {spec.label}</span>
                                <span className="text-text-main">{spec.val}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
