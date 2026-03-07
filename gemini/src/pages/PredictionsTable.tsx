import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    Printer,
    ChevronLeft,
    ChevronRight,
    Info,
    Download,
    AlertTriangle,
    BrainCircuit,
    Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext, PredictionRow } from '../context/AppContext';
import { InquiryDrawer } from '../components/InquiryDrawer';
import { CustomSelect } from '../components/CustomSelect';
import { ShieldCheck } from '../components/Sidebar';

export function PredictionsTable() {
    const { predictions, selectedContainer, setSelectedContainer } = useAppContext();
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const filteredData = useMemo(() => {
        return predictions.filter(item => {
            const matchesFilter = filter === 'All' ||
                (filter === 'Moderate' ? (item.Risk_Level === 'Medium' || item.Risk_Level === 'Moderate') : item.Risk_Level === filter);
            const matchesSearch = item.Container_ID.toString().toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [predictions, filter, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (val: string) => {
        setFilter(val);
        setCurrentPage(1);
    };

    if (predictions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-text-muted space-y-6 transition-all duration-300">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center animate-spin-slow">
                        <Database size={40} className="text-primary/40" />
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase">No Intelligence Stream</h3>
                    <p className="max-w-xs mx-auto text-sm">Upload a manifest dataset to activate the real-time AI risk matrix.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 relative print:hidden">
                <div>
                    <h2 className="text-3xl font-black mb-2 tracking-tighter text-text-main flex items-center gap-3 uppercase">
                        Risk <span className="text-primary">Predictions</span>
                        <span className="bg-primary/20 text-primary text-[10px] px-3 py-1 rounded-full border border-primary/30 uppercase tracking-[0.2em] font-black animate-pulse shadow-lg shadow-primary/20">Active</span>
                    </h2>
                    <p className="text-text-muted text-sm font-medium italic">High-fidelity classification of {predictions.length} neural vectors.</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto z-10">
                    <div className="relative flex-1 md:flex-none md:min-w-[280px] group">
                        <label className="absolute -top-5 left-1 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">Universal Search</label>
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Container ID..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full bg-surface border border-surfaceHighlight/50 py-3 pl-10 pr-4 rounded-2xl focus:outline-none focus:border-primary/50 text-sm font-bold text-text-main transition-all shadow-inner hover:bg-surfaceHighlight/20 placeholder:opacity-50"
                        />
                    </div>

                    <CustomSelect
                        label="Intensity Filter"
                        options={[
                            { value: 'All', label: 'All Tiers' },
                            { value: 'Critical', label: 'Critical' },
                            { value: 'Moderate', label: 'Moderate' },
                            { value: 'Low', label: 'Standard' }
                        ]}
                        value={filter}
                        onChange={handleFilterChange}
                    />

                    <button
                        onClick={() => window.print()}
                        className="p-3 bg-surface border border-surfaceHighlight/50 rounded-2xl text-text-muted hover:text-primary hover:border-primary/50 transition-all shadow-lg active:scale-90 group"
                        title="Generate Report"
                    >
                        <Printer size={20} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="dashboard-card p-0 overflow-hidden border-surfaceHighlight/30 shadow-2xl relative group print:border-none print:shadow-none">
                {/* Print Only Header */}
                <div className="hidden print:block p-8 border-b-2 border-primary/30 mb-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl">
                                <ShieldCheck size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">SmartContainer</h1>
                                <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Security Report</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Generation Date</p>
                            <p className="text-sm font-bold">{new Date().toLocaleDateString()} — {new Date().toLocaleTimeString()}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-2">Authorized Analyst</p>
                            <p className="text-sm font-bold uppercase">A. Carter — Customs Protocol</p>
                        </div>
                    </div>
                    <div className="mt-8 p-4 bg-primary/5 border-l-4 border-primary rounded-r-xl">
                        <p className="text-xs italic text-text-main">
                            "This document contains AI-generated risk intelligence for manifest batch analysis.
                            Unauthorized distribution is strictly prohibited under Protocol 7-B."
                        </p>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-40 -z-10 print:hidden" />

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-background/80 backdrop-blur-md border-b border-surfaceHighlight/50 text-text-muted text-[10px] uppercase font-black tracking-[0.3em]">
                                <th className="p-6">Unit Identifier</th>
                                <th className="p-6">Risk Profile</th>
                                <th className="p-6">Classification</th>
                                <th className="p-6">Anomaly Status</th>
                                <th className="p-6">Neural Inference Summary</th>
                                <th className="p-6 text-center">Diagnostics</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surfaceHighlight/20 text-sm font-medium">
                            <AnimatePresence mode="popLayout">
                                {paginatedData.map((item: PredictionRow, idx: number) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ delay: idx * 0.02 }}
                                        key={item.Container_ID}
                                        onClick={() => setSelectedContainer(item)}
                                        className={`group/row cursor-pointer transition-all duration-300 border-l-[4px] shadow-sm active:scale-[0.99] ${item.Risk_Level === 'Critical' ? 'border-l-critical bg-critical/[0.02] hover:bg-critical/[0.05]' :
                                            item.Risk_Level === 'Medium' || item.Risk_Level === 'Moderate' ? 'border-l-warning bg-warning/[0.02] hover:bg-warning/[0.05]' :
                                                item.Risk_Level === 'Anomaly' ? 'border-l-warning bg-warning/[0.02] hover:bg-warning/[0.05]' :
                                                    'border-l-transparent hover:bg-surfaceHighlight/10'
                                            }`}
                                    >
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="font-mono font-black text-text-main tracking-widest text-base group-hover/row:text-primary transition-colors">{item.Container_ID}</span>
                                                <span className="text-[10px] text-text-muted/60 font-black uppercase tracking-widest mt-1">Ref: SCN-{(idx + 700).toString(16).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 min-w-[200px]">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                                                    <span className="text-text-muted/70">Risk Certainty</span>
                                                    <span className={item.Risk_Level === 'Critical' ? 'text-critical' : 'text-text-main'}>{item.Risk_Score}%</span>
                                                </div>
                                                <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden ring-1 ring-surfaceHighlight/20 shadow-inner">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.Risk_Score}%` }}
                                                        className={`h-full rounded-full transition-all duration-1000 ${item.Risk_Level === 'Critical' ? 'bg-critical shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                                                            item.Risk_Level === 'Medium' ? 'bg-warning' :
                                                                'bg-success'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className={`w-24 h-6 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest border transition-all ${item.Risk_Level === 'Critical' ? 'bg-critical/10 text-critical border-critical/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' :
                                                item.Risk_Level === 'Medium' || item.Risk_Level === 'Moderate' ? 'bg-warning/10 text-warning border-warning/30' :
                                                    'bg-success/10 text-success border-success/30'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full mr-2 ${item.Risk_Level === 'Critical' ? 'bg-critical animate-pulse' : (item.Risk_Level === 'Medium' || item.Risk_Level === 'Moderate') ? 'bg-warning' : 'bg-success'
                                                    }`} />
                                                {item.Risk_Level === 'Critical' ? 'Critical Risk' : (item.Risk_Level === 'Medium' || item.Risk_Level === 'Moderate') ? 'Moderate Risk' : 'Low Risk'}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {(item.Anomaly_Flag === 'Yes' || item.Risk_Level === 'Anomaly') ? (
                                                <div className="flex items-center gap-2 text-warning group-hover/row:scale-110 transition-transform origin-left">
                                                    <div className="p-1.5 bg-warning/10 rounded-lg border border-warning/20">
                                                        <AlertTriangle size={14} className="animate-pulse" />
                                                    </div>
                                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">Anomaly</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-text-muted/30 font-black uppercase tracking-widest">Standard</span>
                                            )}
                                        </td>
                                        <td className="p-6 text-text-main text-xs font-medium max-w-sm xl:max-w-md italic leading-relaxed group-hover/row:opacity-100 opacity-70 transition-opacity">
                                            "{item.Explanation_Summary}"
                                        </td>
                                        <td className="p-6 text-center">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedContainer(item); }}
                                                className="group/btn relative w-12 h-12 rounded-2xl bg-surface border border-surfaceHighlight/50 flex items-center justify-center hover:bg-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.6)] hover:border-primary/50"
                                                title="Open Diagnostics"
                                            >
                                                <BrainCircuit size={22} className="text-primary group-hover/btn:text-white group-hover/btn:rotate-12 transition-all duration-500" />
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg shadow-primary/40 group-hover/btn:scale-150 transition-transform" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {!paginatedData.length && (
                        <div className="p-20 text-center text-text-muted uppercase font-black tracking-widest text-sm italic opacity-50">
                            No units matching the encryption protocol.
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-surfaceHighlight/20 flex flex-col sm:flex-row items-center justify-between gap-8 bg-surface/30 backdrop-blur-md relative z-10 print:hidden">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">
                        Batch Index: <span className="text-text-main tracking-normal">{startIndex + 1} — {Math.min(startIndex + rowsPerPage, filteredData.length)}</span> of <span className="text-primary tracking-normal">{filteredData.length.toLocaleString()}</span> units detected
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePageChange(currentPage - 1); }}
                            disabled={currentPage === 1}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-surfaceHighlight/50 bg-background/50 text-text-muted hover:text-primary hover:border-primary/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl active:scale-90"
                        >
                            <ChevronLeft size={22} />
                        </button>

                        <div className="flex items-center gap-2">
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                let pageNum = currentPage;
                                if (totalPages <= 5) pageNum = i + 1;
                                else if (currentPage <= 3) pageNum = i + 1;
                                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = currentPage - 2 + i;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={(e) => { e.stopPropagation(); handlePageChange(pageNum); }}
                                        className={`w-12 h-12 flex items-center justify-center rounded-2xl text-[10px] font-black transition-all border ${currentPage === pageNum
                                            ? 'bg-primary text-white shadow-[0_0_25px_rgba(var(--primary),0.5)] border-primary/50'
                                            : 'text-text-muted bg-background/30 hover:text-text-main border-surfaceHighlight/20 hover:border-surfaceHighlight/60'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); handlePageChange(currentPage + 1); }}
                            disabled={currentPage === totalPages}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-surfaceHighlight/50 bg-background/50 text-text-muted hover:text-primary hover:border-primary/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl active:scale-90"
                        >
                            <ChevronRight size={22} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Drawer removed - handled globally in App.tsx */}

            <style>{`
                @media print {
                    @page { size: auto; margin: 10mm; }
                    body { background: white !important; color: black !important; }
                    
                    /* Hide everything by default except our targeted report area */
                    #root > div > div:not(.ml-64),
                    header, aside, .print\\:hidden { display: none !important; }
                    
                    /* Reset main container spacing */
                    .ml-64 { margin: 0 !important; padding: 0 !important; width: 100% !important; height: auto !important; overflow: visible !important; display: block !important; position: static !important; }
                    main { margin: 0 !important; padding: 0 !important; height: auto !important; overflow: visible !important; display: block !important; position: static !important; }
                    .max-w-7xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
                    
                    /* Table and Document styling */
                    .dashboard-card { 
                        border: none !important; 
                        box-shadow: none !important; 
                        background: transparent !important; 
                        padding: 0 !important;
                        overflow: visible !important;
                        display: block !important;
                    }
                    
                    .overflow-x-auto {
                        overflow: visible !important;
                        display: block !important;
                    }
                    
                    table { 
                        width: 100% !important; 
                        border-collapse: collapse !important; 
                        table-layout: fixed !important;
                        color: black !important;
                    }
                    
                    th { 
                        color: #000 !important; 
                        background: #f1f5f9 !important; 
                        border-bottom: 2px solid #334155 !important; 
                        padding: 12px 8px !important;
                        text-transform: uppercase !important;
                        font-size: 10px !important;
                        text-align: left !important;
                    }
                    
                    td { 
                        border-bottom: 1px solid #e2e8f0 !important; 
                        padding: 12px 8px !important;
                        font-size: 11px !important;
                        vertical-align: top !important;
                        word-wrap: break-word !important;
                        color: #000 !important;
                        background: white !important;
                    }

                    tr {
                        page-break-inside: avoid !important;
                        background: white !important;
                    }

                    /* Color coding for visibility in print */
                    .border-l-critical { border-left: 6px solid #ef4444 !important; }
                    .border-l-warning { border-left: 6px solid #f59e0b !important; }
                    
                    /* Hide scrollbars and animations */
                    ::-webkit-scrollbar { display: none; }
                    * { 
                        transition: none !important; 
                        animation: none !important; 
                        transform: none !important; 
                        box-shadow: none !important;
                        text-shadow: none !important;
                    }
                }
            `}</style>
        </div >
    );
}
