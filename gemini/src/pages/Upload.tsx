import React, { useState } from 'react';
import { UploadCloud, FileType, CheckCircle, Loader2, Search, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext, PredictionRow } from '../context/AppContext';

interface UploadProps {
    onUploadSuccess?: () => void;
}

export function Upload({ onUploadSuccess }: UploadProps) {
    const { setPredictions } = useAppContext();
    const [isDragOver, setIsDragOver] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleRunAnalysis = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/predict_batch`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            // Handle JSON response
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                // Map the new JSON format back to the PredictionRow format expected by the app
                const parsedData: PredictionRow[] = data.results.map((item: any) => ({
                    ...item.details,
                    Risk_Level: item.prediction.replace(" Risk", ""), // Normalize back to 'Critical', 'Low', etc.
                    Risk_Score: item.confidence * 100
                }));

                setPredictions(parsedData);
                setAnalysisComplete(true);

                // Automatically redirect to dashboard after a short delay
                if (onUploadSuccess) {
                    setTimeout(() => {
                        onUploadSuccess();
                    }, 1500); // 1.5s delay to show the success state
                }
            } else {
                throw new Error("Dataset analysis returned no results.");
            }

        } catch (error: any) {
            console.error("Analysis failed", error);
            setError(error.message || "Failed to analyze dataset.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleDownload = () => {
        if (downloadUrl && file) {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `Risk_Analysis_${file.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-3xl font-black text-text-main uppercase tracking-tighter leading-none">Intelligence <span className="text-primary">Ingestion</span></h2>
                <p className="text-text-muted font-bold text-sm uppercase tracking-widest opacity-60">Upload manifest data for neural risk classification.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div
                        className={`w-full relative overflow-hidden rounded-[32px] p-16 text-center transition-all duration-500 border-2 border-dashed ${isDragOver
                            ? 'border-primary bg-primary/10 shadow-[0_0_80px_rgba(var(--primary),0.2)]'
                            : 'border-surfaceHighlight/50 hover:border-primary/50 bg-surface/30 hover:bg-surface/50 backdrop-blur-md'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

                        <div className="flex justify-center mb-10 relative z-10">
                            <motion.div
                                animate={isDragOver ? { y: -15, scale: 1.1, rotate: 5 } : { y: 0, scale: 1, rotate: 0 }}
                                className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl border transition-colors ${isDragOver ? 'bg-primary text-white border-primary/50' : 'bg-surfaceHighlight/30 text-primary border-surfaceHighlight/50'
                                    }`}
                            >
                                <UploadCloud size={48} strokeWidth={2.5} />
                            </motion.div>
                        </div>

                        <h3 className="text-3xl font-black mb-3 text-text-main relative z-10 tracking-tighter uppercase leading-none">
                            {isDragOver ? 'Release to Scan' : 'Drop Intelligence Stream'}
                        </h3>
                        <p className="text-text-muted mb-10 text-xs relative z-10 font-black uppercase tracking-[0.3em] opacity-60">Architect: CSV / XLSX / JSON — Bulk Protocol</p>

                        <label className="cursor-pointer relative z-10 group inline-block">
                            <div className="absolute -inset-1 bg-primary/30 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl relative flex items-center gap-3 active:scale-95">
                                <Search size={18} />
                                Access local archives
                            </div>
                            <input type="file" className="hidden" accept=".csv,.xlsx" onChange={handleFileInput} />
                        </label>
                    </div>
                </div>

                <div className="dashboard-card border-surfaceHighlight/40 flex flex-col justify-between shadow-2xl relative overflow-hidden p-8">
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                        <h3 className="font-black text-sm uppercase tracking-[0.3em] border-b border-surfaceHighlight/20 pb-6 mb-8 flex items-center gap-3 text-text-main">
                            <FileType size={20} className="text-primary" /> Vector Status
                        </h3>

                        {!file ? (
                            <div className="flex flex-col items-center justify-center py-12 text-text-muted/40">
                                <Activity size={50} className="mb-4 opacity-20" />
                                <p className="text-[10px] uppercase font-black tracking-widest leading-none">No active stream detected</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-background/50 p-5 rounded-2xl flex items-center gap-5 border border-surfaceHighlight/30 shadow-inner group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 group-hover:rotate-6 transition-transform">
                                    <FileType size={28} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-black text-text-main truncate uppercase tracking-tighter">{file.name}</p>
                                    <p className="text-[10px] text-text-muted font-bold tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB — ARCHIVE</p>
                                </div>
                                {analysisComplete && <CheckCircle size={24} className="text-success glow-primary" />}
                            </motion.div>
                        )}
                    </div>

                    <div className="mt-10 relative z-10 space-y-4">
                        <button
                            onClick={handleRunAnalysis}
                            disabled={!file || isAnalyzing || analysisComplete}
                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl border ${!file || analysisComplete
                                ? 'bg-surfaceHighlight/20 text-text-muted/50 border-surfaceHighlight/30 cursor-not-allowed'
                                : isAnalyzing
                                    ? 'bg-primary/50 text-white border-primary/30 cursor-wait'
                                    : 'bg-primary text-white border-primary/50 hover:shadow-[0_0_40px_rgba(var(--primary),0.4)] hover:scale-[1.03] active:scale-95'
                                }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Synchronizing...
                                </>
                            ) : analysisComplete ? (
                                <>
                                    <Zap size={20} className="text-success" />
                                    Risk Matrix Active
                                </>
                            ) : (
                                <>
                                    <Activity size={20} /> Deploy AI Models
                                </>
                            )}
                        </button>

                        {analysisComplete && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center justify-center gap-2 bg-surfaceHighlight/40 hover:bg-surfaceHighlight/60 text-text-main py-4 rounded-xl border border-surfaceHighlight/50 transition-all font-bold text-[10px] uppercase tracking-widest active:scale-95"
                                >
                                    Download CSV
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center justify-center gap-2 bg-surfaceHighlight/40 hover:bg-surfaceHighlight/60 text-text-main py-4 rounded-xl border border-surfaceHighlight/50 transition-all font-bold text-[10px] uppercase tracking-widest active:scale-95"
                                >
                                    Print Report
                                </button>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-critical/10 border border-critical/30 p-4 rounded-xl text-critical text-[10px] font-black uppercase tracking-widest mt-4"
                            >
                                Error: {error}
                            </motion.div>
                        )}

                        {isAnalyzing && (
                            <div className="mt-8 space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-text-muted px-1">
                                    <span className="flex items-center gap-2"><Activity size={10} className="text-primary animate-pulse" /> Processing Vector Atlas...</span>
                                    <span className="animate-pulse">Active</span>
                                </div>
                                <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden relative border border-surfaceHighlight/10">
                                    <motion.div
                                        className="bg-primary h-full rounded-full absolute left-0 shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                        animate={{ left: ["-100%", "100%"] }}
                                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                        style={{ width: "60%" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
