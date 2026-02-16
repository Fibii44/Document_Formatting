import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ templates }) {
    return (
        <MainLayout>
            <Head title="Generate Report" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Generate Report</h1>
                <p className="text-green-600 text-sm font-semibold">Templates</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">List of Templates</h2>
                        <p className="text-gray-400 text-sm">List of Templates that can be used.</p>
                    </div>
                    
                    <Link 
                        href={route('templates.select')} 
                        className="flex items-center bg-[#469a21] hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition shadow-sm"
                    >
                        <span className="mr-2 text-xl leading-none">+</span>
                        New Template
                    </Link>
                </div>

                {/* Main Content Area */}
                <div className="min-h-[400px] border border-gray-200 rounded-[2rem] p-8 bg-white">
                    {templates && templates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {templates.map((template) => (
                                <Link 
                                    key={template.id}
                                    href={`/generate-report/${template.id}/fill`}
                                    className="group relative block aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-[#469a21] to-[#e7b422] p-6 text-white shadow-lg transition-transform hover:-translate-y-1"
                                >
                                    {/* Icon Container */}
                                    <div className="mb-4 inline-block rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                                        <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                        </svg>
                                    </div>

                                    {/* Template Details matching your screenshot */}
                                    <h3 className="text-lg font-bold leading-tight mb-1">{template.name}</h3>
                                    <p className="text-xs font-medium opacity-90 mb-6">Type : {template.type.toUpperCase()}</p>
                                    
                                    <div className="mt-auto space-y-1">
                                        <p className="text-[10px] font-semibold opacity-80 uppercase tracking-wider">
                                            Coordinated Maps: {template.field_mappings ? Object.keys(template.field_mappings).length : 0} fields
                                        </p>
                                        <p className="text-[10px] font-semibold opacity-60">
                                            Created: {new Date(template.created_at).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        /* Empty State matching your previous design */
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="bg-[#333] p-4 rounded-xl mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <h3 className="text-gray-900 font-bold text-base">No Templates Yet</h3>
                            <p className="text-gray-400 text-sm mt-1">Start by creating your first report template</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}