import React from 'react';

export default function Header({ title, user }) {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
            {/* Left Side: Mobile Menu Toggle (Optional) */}
            <div className="flex items-center">
                <button className="text-gray-500 focus:outline-none lg:hidden">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Center: The Title shown in your screenshot */}
            <div className="text-sm font-bold text-gray-700 tracking-widest uppercase">
                {title || "INFINITY HUB INTERNS"}
            </div>

            {/* Right Side: User Dropdown */}
            <div className="flex items-center">
                <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-[10px] text-white">
                        {/* Shortened User Avatar Icon */}
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-600 truncate max-w-[150px]">
                        Jhon Lester Paypa Ybanez
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </header>
    );
}