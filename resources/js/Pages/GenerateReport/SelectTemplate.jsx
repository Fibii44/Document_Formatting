import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react'; // Add Link here

export default function SelectTemplate() {
    return (
        <MainLayout>
            <Head title="Select Template Type" />
            
            <div className="mb-6">
                <Link
                    href={route('generate-reports.index')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-600 transition mb-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Templates
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Generate Report</h2>
                <nav className="text-sm gap-2 flex items-center">
                    <Link href="/generate-reports" className="text-gray-400 hover:text-green-600 transition">Templates</Link>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-green-600 font-semibold">Select Template</span>
                </nav>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-1 text-gray-800">Create New Template</h3>
                <p className="text-gray-400 text-sm mb-8 font-medium">Choose how you want to build your report layout.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                    
                    {/* Text Template Option */}
                    <Link 
                        href={route('templates.text-editor')} 
                        className="w-full max-w-sm p-10 border-2 border-dashed border-gray-200 rounded-[2rem] hover:border-green-500 hover:bg-green-50/30 transition-all group text-center"
                    >
                        <div className="text-6xl font-serif mb-4 text-gray-300 group-hover:text-green-600 transition-colors">Aa</div>
                        <div className="text-xl font-bold text-gray-800">Text Template</div>
                        <p className="text-gray-500 text-sm mt-2">Create a simple text-based report editor.</p>
                    </Link>

                    {/* Upload Document Option - LINKS TO YOUR MAPPER */}
                    <Link 
                        href={route('templates.mapper')} 
                        className="w-full max-w-sm p-10 border-2 border-dashed border-gray-200 rounded-[2rem] hover:border-green-500 hover:bg-green-50/30 transition-all group text-center"
                    >
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="text-xl font-bold text-gray-800">Upload Document</div>
                        <p className="text-gray-500 text-sm mt-2">Upload PDF and map data fields visually.</p>
                    </Link>

                </div>
            </div>
        </MainLayout>
    );
}