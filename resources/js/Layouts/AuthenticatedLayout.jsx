import { useState } from 'react';
import { usePage } from '@inertiajs/react';
// Use relative imports since they are in the same folder
import Header from './Header'; 
import Sidebar from '../Components/Sidebar'; 

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [showingSidebar, setShowingSidebar] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Your Custom Sidebar */}
            <Sidebar 
                isOpen={showingSidebar} 
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Your Custom Header with the dynamic signature/logout dropdown */}
                <Header 
                    onToggleSidebar={() => setShowingSidebar(!showingSidebar)} 
                    title="Account Settings" 
                />

                {/* Sub-header (The "Back to Dashboard" row from Edit.jsx) */}
                {header && (
                    <header className="bg-white border-b border-gray-100 shadow-sm">
                        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}