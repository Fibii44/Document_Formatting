import React from 'react';
import { Link } from '@inertiajs/react';

export default function Sidebar({ user, isOpen }) {
    return (
        <aside 
            className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
                flex flex-col transform transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:relative lg:translate-x-0 
                ${!isOpen ? 'lg:hidden w-0' : 'lg:w-64'}
            `}
        >
            {/* Logo Area */}
            <div className="p-4 border-b border-gray-100 flex justify-center bg-white">
                <img 
                    src="/images/ManPro-Dz47z6mq.png" 
                    alt="ManPro" 
                    className="h-12 w-auto object-contain" 
                />
            </div>

            {/* Profile Section - Geometric Green Style */}
            <div 
                className="p-6 text-center text-white relative bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: "url('/images/avatar_background.png')" }}
            >
                <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white overflow-hidden shadow-lg bg-gray-200">
                         <img src="/images/admin-T7M93j7i.png" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-sm drop-shadow-md">Jhon Lester Paypa Ybanez</h4>
                    <p className="text-xs opacity-90 drop-shadow-sm">Admin</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto">
                <Link href="/dashboard" className="flex items-center p-3 text-green-700 bg-green-50 rounded-lg group">
                    <span className="mr-3">
                         <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    </span>
                    <span className="font-medium text-sm whitespace-nowrap">My Dashboard</span>
                </Link>

                <div className="mt-6 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    My Workspace
                </div>

             
                <Link href="/generate-reports" className="flex items-center p-3 mt-2 text-orange-700 bg-orange-100 border-l-4 border-orange-400 rounded-r-lg shadow-sm">
                    <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span className="text-sm font-bold whitespace-nowrap">Generate Reports</span>
                </Link>
            </nav>
        </aside>
    );
}