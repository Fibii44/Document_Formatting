    import React from 'react';
    import { Link } from '@inertiajs/react';

    export default function Sidebar({ user }) {
        return (
            <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
                {/* Logo Area */}
                <div className="p-4 border-b border-gray-100 flex justify-center">
                    <img src="/images/manpro-logo.png" alt="ManPro" className="h-12" />
                </div>

                {/* Profile Section (The Green Box) */}
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 text-center text-white relative">
                    <div className="w-20 h-20 bg-blue-900 rounded-full mx-auto mb-3 border-4 border-white overflow-hidden">
                        {/* Placeholder for Profile Pic */}
                    </div>
                    <h4 className="font-bold text-sm">Jhon Lester Paypa Ybanez</h4>
                    <p className="text-xs opacity-90">Admin</p>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 mt-4 px-2">
                    <Link href="/dashboard" className="flex items-center p-3 text-gray-600 hover:bg-green-50 rounded-lg group">
                        <span className="ml-3 font-medium group-hover:text-green-600 text-sm">My Dashboard</span>
                    </Link>

                    <div className="mt-4 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        My Workspace
                    </div>

                    {/* The Link to your Select Template page */}
                    <Link 
                        href="/generate-reports" 
                        className="flex items-center p-3 mt-1 text-gray-600 hover:bg-orange-50 bg-orange-100 border-l-4 border-orange-400 rounded-r-lg"
                    >
                        <span className="ml-3 font-medium text-orange-700 text-sm">Generate Reports</span>
                    </Link>
                </nav>
            </div>
        );
    }