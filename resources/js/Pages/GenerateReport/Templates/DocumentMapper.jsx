import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Draggable from 'react-draggable';
import ValidationError from '@/Components/ValidationError';
import SuccessMessage from '@/Components/SuccessMessage';

const PREVIEW_DATA = {
    '@Employee Name (First, MI, Last)': 'JHON LESTER PAYPA YBANEZ',
    '@Employee Name (Last, First, MI)': 'YBANEZ, JHON LESTER P.',
    '@Employee Name (Last, First)': 'YBANEZ, JHON LESTER',
    '@Role': 'WEB DEVELOPER',
    '@Department': 'INFINITY HUB INTERNS',
    '@Email': 'jhonlester@example.com',
    '@Join Date': 'FEB 17, 2026',
};

const FIELD_DETAILS = {
    '@Employee Name (First, MI, Last)': 'Full name of the Employee',
    '@Employee Name (Last, First, MI)': 'Formal format',
    '@Employee Name (Last, First)': 'Last and First name only',
    '@Role': 'Job Title/Role',
    '@Department': 'Department name',
    '@Email': 'Email Address',
    '@Join Date': 'Employment Start Date',
};

export default function DocumentMapper() {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const [fileError, setFileError] = useState(null);
    const [fileSuccess, setFileSuccess] = useState(null);

    const { data, setData, post, processing } = useForm({
        name: '',
        type: 'upload', 
        file: null,
        mappings: [], 
    });

    // Automatic Timer: Clear messages after 3 seconds
    useEffect(() => {
        if (fileSuccess || fileError) {
            const timer = setTimeout(() => {
                setFileSuccess(null);
                setFileError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [fileSuccess, fileError]);

    const processFile = (selectedFile) => {
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            setFileError("Word documents cannot be mapped directly. Please open your file in Word and 'Save As PDF' first.");
            setFileSuccess(null);
            setData('file', null);
            return;
        }

        setFileError(null);
        setFileSuccess(`"${selectedFile.name}" loaded successfully.`);
        setData('file', selectedFile);
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsOver(true); };
    const handleDragLeave = () => setIsOver(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsOver(false);
        processFile(e.dataTransfer.files[0]);
    };

    useEffect(() => {
        if (!data.file) { setPreviewUrl(null); return; }
        const objectUrl = URL.createObjectURL(data.file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [data.file]);

    const addField = (tag) => {
        setData('mappings', [...data.mappings, { id: Date.now(), tag, x: 0, y: 0 }]);
    };

    const handleStop = (id, e, d) => {
        setData('mappings', data.mappings.map(m => m.id === id ? { ...m, x: d.x, y: d.y } : m));
    };

    const removeField = (id) => {
        setData('mappings', data.mappings.filter(m => m.id !== id));
    };

    return (
        <MainLayout>
            <Head title="Document Visual Mapper" />

            <div className="mb-6">
                <Link href={route('templates.select')} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-600 transition mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Back to Select Template
                </Link>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Generate Report</h1>
                <nav className="flex items-center text-sm gap-2 mb-2">
                    <Link href="/generate-reports" className="text-gray-400 hover:text-green-600 transition">Templates</Link>
                    <span className="text-gray-400">&gt;</span>
                    <Link href="/generate-report/select" className="text-gray-400 hover:text-green-600 transition">Select Template</Link>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-green-600 font-semibold">Visual Mapper</span>
                </nav>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Notification Area with 3s Auto-hide */}
                <ValidationError message={fileError} onClear={() => setFileError(null)} />
                <SuccessMessage message={fileSuccess} onClear={() => setFileSuccess(null)} />

                    

                <div className="flex justify-between items-center mb-8 gap-4">
                    <input 
                        type="text" value={data.name} disabled={showConfirmation}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Template Name..." 
                        className="flex-1 border border-gray-200 rounded-xl focus:ring-green-500 text-sm py-2.5 px-4"
                    />

                    <div className="flex gap-3">
                        {!showConfirmation ? (
                            <>
                                <label className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer">
                                    {data.file ? 'Change PDF' : 'Upload PDF'}
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => processFile(e.target.files[0])} />
                                </label>
                                <button type="button" disabled={!data.file || !data.name || data.mappings.length === 0} onClick={() => setShowConfirmation(true)} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition disabled:opacity-30 shadow-sm">
                                    Check Preview
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" onClick={() => setShowConfirmation(false)} className="px-5 py-2.5 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-100 transition">Back to Edit</button>
                                <button type="button" onClick={() => post(route('templates.save'))} disabled={processing} className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition shadow-lg">Confirm & Save</button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex gap-8 max-h-[850px]">
                    {!showConfirmation && (
                        <div className="w-[340px] border border-gray-100 rounded-2xl p-5 bg-white h-fit sticky top-0 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-6 text-base tracking-tight">Available Data Fields</h3>
                            <div className="space-y-3">
                                {Object.keys(FIELD_DETAILS).map((tag) => (
                                    <button key={tag} type="button" onClick={() => addField(tag)} className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50/10 transition-all shadow-sm group">
                                        <p className="text-green-600 font-bold text-[12px] mb-1 leading-tight group-hover:text-green-700">{tag}</p>
                                        <p className="text-gray-400 text-[10px] font-medium leading-relaxed italic">{FIELD_DETAILS[tag]}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex-1 flex flex-col">
                        {/* Tip disappears once first tag is placed */}
                        {data.file && data.mappings.length === 0 && !showConfirmation && (
                            <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3 shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-top-2">
                                <div className="bg-blue-500 rounded-full p-1"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                <p className="text-blue-800 text-xs font-semibold tracking-tight">Quick Tip: Select a field from the left, then drag its tag exactly where you want it on the PDF.</p>
                            </div>
                        )}

                        <div 
                            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                            className={`flex-1 rounded-[2rem] border-2 border-dashed overflow-auto p-8 relative shadow-inner scrollbar-thin transition-all duration-300 ${isOver ? 'bg-green-50 border-green-400 scale-[0.99]' : 'bg-gray-200 border-gray-300'}`}
                        >
                            {previewUrl ? (
                                <div className="relative mx-auto bg-white shadow-2xl" style={{ width: '794px', minHeight: '1123px' }}>
                                    <iframe src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`} className="absolute inset-0 w-full h-full border-none pointer-events-none" />
                                    <div className="absolute inset-0 z-10">
                                        {data.mappings.map((m) => (
                                            <Draggable key={m.id} bounds="parent" disabled={showConfirmation} position={{x: m.x, y: m.y}} onStop={(e, d) => handleStop(m.id, e, d)}>
                                                <div style={{ fontFamily: 'Helvetica, Arial, sans-serif' }} className={`absolute p-1 font-bold flex items-center gap-2 transition-all ${showConfirmation ? 'bg-transparent text-black border-none shadow-none text-[13.33px] -mt-[4px]' : 'bg-white/90 text-blue-700 border border-blue-400 shadow-md cursor-move text-[10px] rounded'}`}>
                                                    <span>{showConfirmation ? PREVIEW_DATA[m.tag] : m.tag}</span>
                                                    {!showConfirmation && <button type="button" onClick={() => removeField(m.id)} className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] hover:bg-red-600 transition-colors">✕</button>}
                                                </div>
                                            </Draggable>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-full text-gray-400 py-32 cursor-pointer group transition-all">
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => processFile(e.target.files[0])} />
                                    <svg className={`w-16 h-16 mb-4 transition-all ${isOver ? 'text-green-500 scale-125 opacity-100' : 'opacity-10 group-hover:opacity-100 group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    <p className={`font-bold text-sm transition-all ${isOver ? 'text-green-600' : 'group-hover:underline'}`}>{isOver ? 'Drop PDF to Upload' : 'Click or Drag & Drop a PDF to start mapping.'}</p>
                                    <p className="text-[10px] mt-2 opacity-50">Supports only PDF files</p>
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}