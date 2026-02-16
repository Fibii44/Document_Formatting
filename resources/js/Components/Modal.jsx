import React from 'react';

export default function ManProModal({ isOpen, onClose, title, subtitle, children, footer }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[1.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Reusable Header with your Green-to-Gold Gradient */}
                <div className="bg-gradient-to-r from-[#469a21] to-[#e7b422] p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{title}</h2>
                            {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold transition">✕</button>
                </div>

                {/* Content Area */}
                <div className="p-8">
                    {children}
                    
                    {/* Optional Footer for Buttons */}
                    {footer && (
                        <div className="mt-8 flex justify-center">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}