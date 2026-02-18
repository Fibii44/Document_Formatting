import React from 'react';

export default function ValidationError({ message, onClear }) {
    if (!message) return null;

    return (
        <div className="mb-6 flex items-center justify-between bg-red-50 border border-red-100 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
                {/* Error Icon */}
                <div className="bg-red-500 text-white p-1.5 rounded-full shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                {/* Error Text */}
                <div>
                    <p className="text-red-800 font-bold text-sm">Action Required</p>
                    <p className="text-red-600/80 text-xs leading-relaxed">{message}</p>
                </div>
            </div>
            {/* Close Button */}
            <button 
                onClick={onClear} 
                className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-100 transition-all"
                title="Dismiss"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}