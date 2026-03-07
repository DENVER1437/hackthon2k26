import React, { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Activity, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function ChartsPanel() {
    const { predictions, theme } = useAppContext();

    const riskDistribution = useMemo(() => {
        if (predictions.length === 0) {
            return [
                { name: 'Critical Risk', value: 3241, color: '#ef4444' },
                { name: 'Moderate Risk', value: 12400, color: '#f59e0b' },
                { name: 'Low Risk', value: 127213, color: '#10b981' },
            ];
        }

        const critical = predictions.filter(p => p.Risk_Level === 'Critical').length;
        const medium = predictions.filter(p => p.Risk_Level === 'Medium').length;
        const low = predictions.filter(p => p.Risk_Level === 'Low').length;

        return [
            { name: 'Critical Risk', value: critical, color: '#ef4444' },
            { name: 'Moderate Risk', value: medium, color: '#f59e0b' },
            { name: 'Low Risk', value: low, color: '#10b981' },
        ].filter(item => item.value > 0);
    }, [predictions]);

    const riskScores = useMemo(() => {
        if (predictions.length === 0) {
            return [
                { range: '0-10', count: 45000 },
                { range: '10-20', count: 35000 },
                { range: '20-30', count: 25000 },
                { range: '30-40', count: 18000 },
                { range: '40-50', count: 12000 },
                { range: '50-60', count: 8000 },
                { range: '60-70', count: 4500 },
                { range: '70-80', count: 2500 },
                { range: '80-90', count: 1200 },
                { range: '90-100', count: 450 },
            ];
        }

        const buckets = Array.from({ length: 10 }, (_, i) => ({
            range: `${i * 10}-${(i + 1) * 10}`,
            count: 0
        }));

        predictions.forEach(p => {
            let score = p.Risk_Score;
            if (score === 100) score = 99.9;
            const bucketIndex = Math.floor(score / 10);
            if (bucketIndex >= 0 && bucketIndex < 10) {
                buckets[bucketIndex].count += 1;
            }
        });

        return buckets;
    }, [predictions]);

    const chartTextColor = theme === 'dark' ? '#94a3b8' : '#475569';
    const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Risk Distribution Chart */}
            <div className="dashboard-card border-surfaceHighlight/30 lg:col-span-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-500" />
                <h3 className="font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2 text-text-main">
                    <TrendingUp size={16} className="text-primary" /> Multi-Tier Risk Matrix
                </h3>
                <div className="h-64 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={riskDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={10}
                                dataKey="value"
                                stroke="none"
                            >
                                {riskDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgb(var(--surface))', border: '1px solid rgb(var(--surface-highlight))', borderRadius: '12px', color: 'rgb(var(--text-main))' }}
                                itemStyle={{ color: 'rgb(var(--text-main))', fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-3 mt-4 relative z-10 px-2">
                    {riskDistribution.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-surfaceHighlight/20 hover:border-surfaceHighlight/50 transition-colors">
                            <div className="flex items-center gap-3">
                                {item.name.includes('Critical') ? <AlertTriangle size={14} color={item.color} /> :
                                    item.name.includes('Low') ? <ShieldCheck size={14} color={item.color} /> :
                                        <Activity size={14} color={item.color} />}
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{item.name}</span>
                            </div>
                            <span className="font-mono font-black text-text-main">
                                {item.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Risk Score Area Chart */}
            <div className="dashboard-card border-surfaceHighlight/30 lg:col-span-2 shadow-2xl relative overflow-hidden group">
                <div className="absolute bottom-0 right-10 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-500" />
                <h3 className="font-black text-sm uppercase tracking-widest mb-8 flex justify-between items-center text-text-main">
                    <span className="flex items-center gap-2"><Activity size={16} className="text-primary" /> Risk Frequency Density Pulse</span>
                    <span className="text-[10px] font-black text-text-muted bg-surfaceHighlight/30 px-3 py-1 rounded-full uppercase">Neural Spectrum</span>
                </h3>
                <div className="h-[24rem] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={riskScores} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis dataKey="range" stroke={chartTextColor} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke={chartTextColor} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgb(var(--surface))', border: '1px solid rgb(var(--surface-highlight))', borderRadius: '12px', color: 'rgb(var(--text-main))' }}
                                labelStyle={{ color: 'rgb(var(--text-muted))', marginBottom: '4px', fontWeight: 'bold' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="rgb(var(--primary))"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorCount)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
