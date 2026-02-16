import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react'; //

export default function Index() {
    // We remove showSelect because we are navigating to a new page now
    return (
        <MainLayout>
            <Head title="Generate Report" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Generate Report</h1>
                <p className="text-green-600 text-sm font-semibold">Templates</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">List of Templates</h2>
                        <p className="text-gray-400 text-sm">List of Templates that can be used.</p>
                    </div>
                    
                    {/* Updated to Link to your SelectTemplate page */}
                    <Link 
                        href={route('templates.select')} 
                        className="flex items-center bg-[#2d8a1e] hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-sm whitespace-nowrap"
                    >
                        <span className="mr-2 text-xl leading-none">+</span>
                        New Template
                    </Link>
                </div>

                {/* Empty State View */}
                <div className="flex flex-col items-center justify-center py-24 border border-gray-200 rounded-[2rem] bg-white text-center">
                    <div className="bg-[#333] p-4 rounded-xl mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <h3 className="text-gray-900 font-bold text-base">No Templates Yet</h3>
                    <p className="text-gray-400 text-sm mt-1">Start by creating your first report template</p>
                </div>
            </div>
        </MainLayout>
    );
}