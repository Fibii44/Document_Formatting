import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Draggable from 'react-draggable';

export default function DocumentMapper() {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'upload', 
        file: null,
        mappings: [], 
    });

    useEffect(() => {
        if (!data.file) {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(data.file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [data.file]);

    const addField = (tag) => {
        const newField = {
            id: Date.now(),
            tag: tag,
            x: 0, 
            y: 0
        };
        setData('mappings', [...data.mappings, newField]);
    };

    const handleStop = (id, e, d) => {
        const updatedMappings = data.mappings.map(m => 
            m.id === id ? { ...m, x: d.x, y: d.y } : m
        );
        setData('mappings', updatedMappings);
        setIsDragging(false); 
    };

    const removeField = (id) => {
        setData('mappings', data.mappings.filter(m => m.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('templates.save'));
    };

    return (
        <MainLayout>
            <Head title="Document Visual Mapper" />

            {/* Header section remains the same */}
            <div className="mb-6">
                <Link
                    href={route('templates.select')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-600 transition mb-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Select Template
                </Link>
                <nav className="flex items-center text-sm gap-2 mb-2">
                    <Link href="/generate-reports" className="text-gray-400 hover:text-green-600 transition">Templates</Link>
                    <span className="text-gray-400">&gt;</span>
                    <Link href="/generate-report/select" className="text-gray-400 hover:text-green-600 transition">Select Template</Link>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-green-600 font-semibold">Document Visual Mapper</span>
                </nav>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Generate Report</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                
                <div className="flex justify-between items-center mb-8 gap-4">
                    <input 
                        type="text" 
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Template Name..." 
                        className="flex-1 border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-sm py-2.5 px-4"
                    />

                    <div className="flex gap-3">
                        <label className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer">
                            {data.file ? 'Change File' : 'Upload File Template'}
                            <input type="file" className="hidden" accept=".pdf" onChange={e => setData('file', e.target.files[0])} />
                        </label>

                        <button type="submit" disabled={processing} className="px-5 py-2.5 bg-gray-700 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition">
                            {processing ? 'Saving...' : 'Save Template'}
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-[320px] border border-gray-100 rounded-2xl p-5 bg-gray-50/40 h-fit">
                        <h3 className="font-bold text-gray-800 mb-5 text-sm uppercase tracking-wider">Available Data Fields</h3>
                        <div className="space-y-3">
                            {['@Employee Name', '@Role', '@Department', '@Email', '@Join Date'].map((tag) => (
                                <button key={tag} type="button" onClick={() => addField(tag)} className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-green-500 transition shadow-sm">
                                    <p className="text-green-600 font-bold text-[11px] uppercase">{tag}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FIXED SCROLLING CANVAS */}
                    <div 
                        className="flex-1 bg-gray-200 rounded-2xl border-2 border-dashed border-gray-300 h-[800px] overflow-auto relative"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {previewUrl ? (
                            /* This wrapper ensures the PDF and tags share the same coordinate space */
                            <div className="relative" style={{ width: '100%', minHeight: '1200px' }}>
                                <iframe 
                                    /* Hiding toolbars and scrollbars inside the iframe */
                                    src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                                    className={`absolute inset-0 w-full h-full border-none ${isDragging ? 'pointer-events-none' : ''}`}
                                    title="Template Preview"
                                />
                                
                                <div className="absolute inset-0 z-10 pointer-events-none">
                                    {data.mappings.map((m) => (
                                        <Draggable 
                                            key={m.id}
                                            bounds="parent"
                                            position={{x: m.x, y: m.y}}
                                            onStart={() => setIsDragging(true)} 
                                            onStop={(e, d) => handleStop(m.id, e, d)}
                                        >
                                            <div className="absolute p-2 bg-green-600 text-white rounded shadow-lg cursor-move text-xs font-bold pointer-events-auto flex items-center gap-2">
                                                {m.tag}
                                                <button type="button" onClick={() => removeField(m.id)} className="bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[8px]">✕</button>
                                            </div>
                                        </Draggable>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-12 text-center text-gray-400">
                                Upload a document to start designing
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </MainLayout>
    );
}