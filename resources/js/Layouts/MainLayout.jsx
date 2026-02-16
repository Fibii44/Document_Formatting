import React from 'react';
import Sidebar from '@/Components/Sidebar';
import Header from './Header';

export default function MainLayout({ children, user }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Using the green/white theme from ManPro */}
            <Sidebar user={user} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="INFINITY HUB INTERNS" user={user} />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}