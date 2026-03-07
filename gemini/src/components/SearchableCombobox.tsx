import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchableComboboxProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onEnter?: () => void;
}

export function SearchableCombobox({ options, value, onChange, placeholder, onEnter }: SearchableComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter options based on search term
    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 50); // Limit results for performance

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        onChange(val);
        if (!isOpen) setIsOpen(true);
    };

    const handleOptionSelect = (opt: string) => {
        onChange(opt);
        setSearchTerm(opt);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (isOpen && filteredOptions.length > 0) {
                handleOptionSelect(filteredOptions[0]);
            } else if (onEnter) {
                onEnter();
            }
            setIsOpen(false);
        }
        if (e.key === 'Escape') setIsOpen(false);
        if (e.key === 'ArrowDown' && !isOpen) setIsOpen(true);
    };

    return (
        <div className="relative w-full max-w-sm" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-background border border-surfaceHighlight rounded-2xl pl-12 pr-12 py-4 text-sm focus:outline-none focus:border-primary text-text-main font-mono transition-all shadow-inner"
                    placeholder={placeholder || "Search IDs..."}
                />
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted opacity-50" />

                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {searchTerm && (
                        <button
                            onClick={() => { setSearchTerm(''); onChange(''); }}
                            className="p-1 hover:bg-surfaceHighlight/30 rounded-full transition-colors text-text-muted"
                        >
                            <X size={14} />
                        </button>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    >
                        <ChevronDown size={18} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        className="absolute z-[60] w-full mt-2 bg-background/95 border border-surfaceHighlight/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono tracking-widest transition-all flex items-center justify-between group ${value === option
                                                ? 'bg-primary text-white shadow-lg'
                                                : 'text-text-muted hover:bg-primary/10 hover:text-primary'
                                            }`}
                                    >
                                        <span>{option}</span>
                                        {value === option && <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center">
                                    <p className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">No Matches Detected</p>
                                </div>
                            )}
                        </div>
                        {filteredOptions.length > 0 && (
                            <div className="bg-surfaceHighlight/10 px-4 py-2 border-t border-surfaceHighlight/20">
                                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                                    Displaying {filteredOptions.length} priority vectors
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
