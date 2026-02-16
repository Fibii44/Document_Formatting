import React from 'react';
import MainLayout from '@/Layouts/MainLayout';

export default function SelectTemplate() {
    return (
        <MainLayout>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Generate Report</h2>
                <p className="text-green-600 text-sm">Templates &gt; <span className="font-semibold">Select Template</span></p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-1">List of Templates</h3>
                <p className="text-gray-400 text-sm mb-8">List of Templates that can be used.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                    {/* Text Template Option */}
                    <button className="w-full max-w-sm p-10 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors group">
                        <div className="text-6xl font-serif mb-4 group-hover:text-green-600">Aa</div>
                        <div className="text-xl font-bold">Text Template</div>
                        <p className="text-gray-500 text-sm">Create a simple text-based report.</p>
                    </button>

                    {/* Upload Document Option */}
                    <button className="w-full max-w-sm p-10 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors group">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="text-xl font-bold">Upload Document</div>
                        <p className="text-gray-500 text-sm">Upload PDF, Docx or CSV and edit text fields.</p>
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}