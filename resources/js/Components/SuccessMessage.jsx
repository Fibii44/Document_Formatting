import React from 'react';

export default function SuccessMessage({ message, onClear }) {
    if (!message) return null;

    return (
        <div className="mb-6 flex items-center justify-between bg-green-50 border border-green-100 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 transition-all">
            <div className="flex items-center gap-3">
                <div className="bg-green-500 text-white p-1.5 rounded-full shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <p className="text-green-800 font-bold text-sm">Success</p>
                    <p className="text-green-600/80 text-xs leading-relaxed">{message}</p>
                </div>
            </div>
            <button 
                onClick={onClear} 
                className="text-green-400 hover:text-green-600 p-1 rounded-lg hover:bg-green-100 transition-all"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}