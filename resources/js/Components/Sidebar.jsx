import React from 'react';
import { Link } from '@inertiajs/react';

export default function Sidebar({ user }) {
    return (
        <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
            {/* Logo Area */}
            <div className="p-4 border-b border-gray-100 flex justify-center">
                <img 
                    src="/images/ManPro-Dz47z6mq.png" 
                    alt="ManPro" 
                    className="h-12 w-auto object-contain" 
                />
            </div>

            {/* Profile Section (Updated with custom background image) */}
            <div 
                className="p-6 text-center text-white relative bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: "url('/images/avatar_background.png')" }}
            >
                {/* Subtle overlay to ensure text contrast */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-blue-900 rounded-full mx-auto mb-3 border-4 border-white overflow-hidden shadow-lg">
                        {/* Placeholder for Profile Pic */}
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/50">
                            JP
                        </div>
                    </div>
                    <h4 className="font-bold text-sm drop-shadow-md">Jhon Lester Paypa Ybanez</h4>
                    <p className="text-xs opacity-90 drop-shadow-sm">Admin</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 mt-4 px-2">
                <Link 
                    href="/dashboard" 
                    className={`flex items-center p-3 rounded-lg group transition-colors ${
                        route().current('dashboard') 
                            ? 'bg-green-50 text-green-700' 
                            : 'text-gray-600 hover:bg-green-50'
                    }`}
                >
                    <svg className="w-5 h-5 opacity-70 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="ml-3 font-medium text-sm group-hover:text-green-600">My Dashboard</span>
                </Link>

                <div className="mt-6 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    My Workspace
                </div>

                {/* Generate Reports Link - Styled as the active Workspace item */}
                <Link 
                    href="/generate-reports" 
                    className="flex items-center p-3 mt-2 text-orange-700 bg-orange-100 border-l-4 border-orange-400 rounded-r-lg shadow-sm"
                >
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="ml-3 font-bold text-sm">Generate Reports</span>
                </Link>
            </nav>

            {/* Optional Logout Section at bottom */}
            <div className="p-4 border-t border-gray-100">
                <Link 
                    href={route('logout')} 
                    method="post" 
                    as="button" 
                    className="flex items-center w-full p-2 text-gray-400 hover:text-red-600 transition-colors text-sm font-medium"
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </Link>
            </div>
        </div>
    );
}