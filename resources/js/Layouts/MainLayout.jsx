import React, { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import Header from './Header';

export default function MainLayout({ children, user }) {
    // 1. Initialize state from localStorage (default to 'true' if not found)
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebar_open');
        return saved !== null ? JSON.parse(saved) : true;
    });

    // 2. Save the state to localStorage whenever it changes
    const toggleSidebar = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        localStorage.setItem('sidebar_open', JSON.stringify(newState));
    };

    return (
        <div className="flex h-screen bg-[#f3f4f6] overflow-hidden w-full">
            <Sidebar user={user} isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300">
                <Header 
                    title="INFINITY HUB INTERNS" 
                    user={user} 
                    onToggleSidebar={toggleSidebar} 
                />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>

            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
}