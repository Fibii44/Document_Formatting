import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function DocumentMapper() {
    // State to hold the temporary URL for the PDF preview
    const [previewUrl, setPreviewUrl] = useState(null);

    // Inertia form helper for backend integration
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        file: null,
        mappings: null, 
    });

    // Effect to generate a preview URL whenever a new file is uploaded
    useEffect(() => {
        if (!data.file) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.file);
        setPreviewUrl(objectUrl);

        // Memory cleanup: revoke the URL when the component unmounts
        return () => URL.revokeObjectURL(objectUrl);
    }, [data.file]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Sends the template data to the backend route
        post(route('templates.save'));
    };

    return (
        <MainLayout>
            <Head title="Document Visual Mapper" />

            {/* Header and Breadcrumbs */}
            <div className="mb-6">
                <nav className="flex items-center text-sm gap-2 mb-2">
                    <Link href="/generate-reports" className="text-gray-400 hover:text-green-600 transition">Templates</Link>
                    <span className="text-gray-400">&gt;</span>
                    <Link href="/generate-report/select" className="text-gray-400 hover:text-green-600 transition">Select Template</Link>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-green-600 font-semibold">Document Visual Mapper</span>
                </nav>
                <div className="flex items-center gap-3">
                    <Link href="/generate-report/select" className="text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Generate Report</h1>
                </div>
            </div>

            {/* Main Workspace Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                
                {/* Top Control Bar */}
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="flex-1">
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="Template Name..." 
                            className="w-full border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-sm py-2.5 px-4 shadow-sm outline-none transition"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1 px-2">{errors.name}</p>}
                    </div>

                    <div className="flex gap-3">
                        {/* Custom File Upload Input */}
                        <label className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {data.file ? 'Change File' : 'Upload File Template'}
                            <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf"
                                onChange={e => setData('file', e.target.files[0])}
                            />
                        </label>

                        <button 
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-md active:scale-95 disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            {processing ? 'Saving...' : 'Save Template'}
                        </button>
                    </div>
                </div>

                <div className="flex gap-8 min-h-[600px]">
                    {/* Left Sidebar: Data Fields */}
                    <div className="w-[300px] border border-gray-100 rounded-2xl p-5 bg-gray-50/40">
                        <h3 className="font-bold text-gray-800 mb-5 text-sm uppercase tracking-wider">Available Data Fields</h3>
                        <div className="space-y-3">
                            {[
                                { tag: '@Employee Name', desc: 'Full name of the Employee' },
                                { tag: '@Role', desc: 'Job Title/Role' },
                                { tag: '@Department', desc: 'Department name' },
                                { tag: '@Email', desc: 'Email Address' },
                                { tag: '@Join Date', desc: 'Employment Start Date' }
                            ].map((field) => (
                                <div key={field.tag} className="p-4 bg-white border border-gray-200 rounded-xl cursor-grab hover:border-green-500 hover:shadow-md transition group">
                                    <p className="text-green-600 font-bold text-[11px] mb-1 uppercase tracking-tight">{field.tag}</p>
                                    <p className="text-gray-400 text-[10px] font-medium leading-tight">{field.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Canvas / PDF Preview */}
                    <div className="flex-1 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 relative overflow-hidden flex items-center justify-center">
                        {previewUrl ? (
                            <iframe 
                                src={previewUrl} 
                                className="w-full h-full rounded-2xl border-none"
                                title="Template Preview"
                            />
                        ) : (
                            <div className="p-12 text-center group">
                                <div className="bg-gray-800 p-5 rounded-2xl mb-5 shadow-lg group-hover:bg-green-600 transition-colors mx-auto w-fit">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <h4 className="text-gray-700 font-bold text-base">Upload a document to start designing</h4>
                                <p className="text-gray-400 text-xs mt-2 max-w-[220px] mx-auto font-medium">
                                    Your PDF will appear here once uploaded for visual mapping.
                                </p>
                                {errors.file && <p className="text-red-500 text-xs mt-4 font-bold">{errors.file}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </MainLayout>
    );
}