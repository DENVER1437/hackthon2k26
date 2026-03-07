import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, Fingerprint, User, Eye, EyeOff, LucideIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Login() {
    const { login, register } = useAppContext();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (mode === 'register') {
            const result = register(name, email, password);
            if (result.success) {
                setFeedback({ type: 'success', text: result.message });
                setMode('login'); // Redirect to login
                setPassword(''); // Clear sensitive data
            } else {
                setFeedback({ type: 'error', text: result.message });
            }
        } else {
            const result = login(email, password);
            if (!result.success) {
                setFeedback({ type: 'error', text: result.message });
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f18] overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/5"></div>

            {/* Animated Grid Lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full border-[0.5px] border-surfaceHighlight/10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] px-6 relative z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center p-4 rounded-3xl bg-primary/20 border border-primary/30 mb-8 shadow-[0_0_40px_rgba(var(--primary),0.2)]"
                    >
                        <Shield size={42} className="text-primary glow-primary" />
                        <motion.div
                            className="absolute -top-2 -right-2 bg-critical text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-lg"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            CLASSIFIED
                        </motion.div>
                    </motion.div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        SmartContainer <span className="text-primary">Risk Engine</span>
                    </h1>
                    <p className="text-text-muted text-[10px] font-black tracking-[0.4em] uppercase opacity-70">
                        Authorized Personnel Only
                    </p>
                </div>

                {/* Auth Card */}
                <div className="dashboard-card border-surfaceHighlight/30 bg-surface/40 backdrop-blur-3xl p-8 shadow-2xl relative">
                    {/* Mode Toggle */}
                    <div className="flex bg-background/50 p-1.5 rounded-2xl mb-10 border border-surfaceHighlight/30">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'register' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div
                                    key="register-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <InputGroup
                                        icon={User}
                                        placeholder="Full Operator Name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <InputGroup
                            icon={Mail}
                            placeholder="Secure Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputGroup
                            icon={Lock}
                            placeholder="Encrypted Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-[10px] font-black uppercase tracking-widest p-4 rounded-xl border flex items-center gap-3 ${feedback.type === 'success'
                                    ? 'bg-success/10 border-success/30 text-success'
                                    : 'bg-critical/10 border-critical/30 text-critical'
                                    }`}
                            >
                                <Shield size={14} className={feedback.type === 'success' ? 'text-success' : 'text-critical'} />
                                {feedback.text}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primaryHighlight py-5 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(59,130,246,0.3)] group mt-10"
                        >
                            {mode === 'login' ? 'Initiate Session' : 'Registry Entry'}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                        <Fingerprint size={12} /> End-To-End Encrypted Terminal
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

function InputGroup({ icon: Icon, placeholder, type, value, onChange }: { icon: LucideIcon, placeholder: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                <Icon size={18} />
            </div>
            <input
                type={isPassword ? (showPassword ? 'text' : 'password') : type}
                required
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-background/50 border border-surfaceHighlight/40 rounded-2xl py-5 pl-12 pr-12 text-sm font-mono text-white placeholder:text-text-muted/30 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors p-1"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>
    );
}
