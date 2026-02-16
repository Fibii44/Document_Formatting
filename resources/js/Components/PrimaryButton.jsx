import React from 'react';

export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `flex items-center bg-[#2d8a1e] hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-sm disabled:opacity-50 ` +
                className
            }
        >
            {children}
        </button>
    );
}