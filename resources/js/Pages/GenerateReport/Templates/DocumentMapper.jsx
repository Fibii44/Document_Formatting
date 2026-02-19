import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Draggable from 'react-draggable';
import ValidationError from '@/Components/ValidationError';
import SuccessMessage from '@/Components/SuccessMessage';
import PageHeader from '@/Components/PageHeader';

// PREVIEW_DATA synced with High Earner (Jhon Lester) from your Seeder
const PREVIEW_DATA = {
    '@Full Name (First MI Last)': 'JHON LESTER P. YBANEZ',
    '@Full Name (Last, First MI)': 'YBANEZ, JHON LESTER P.',
    '@Full Name (Last, First)': 'YBANEZ, JHON LESTER',
    '@Middle Name': 'PAYPA',
    '@TIN': '987-654-321-000',
    '@Role': 'SENIOR WEB DEVELOPER',
    '@Department': 'IT DEPARTMENT',
    '@Email': 'jhonlester@example.com',
    '@Join Date': 'FEB 17, 2026',
    '@Monthly Salary': '85,000.00',
    '@Holiday Pay': '5,000.00',
    '@Overtime Pay': '8,000.00',
    '@Hazard Pay': '0.00',
    '@MWE Status': 'NO',
    '@Exempt Bonus': '90,000.00',    
    '@Taxable Bonus': '30,000.00',   
    '@Total Contributions': '3,125.00', 
};

const FIELD_DETAILS = {
    '@Full Name (First MI Last)': 'Standard format: JHON LESTER P. YBANEZ',
    '@Full Name (Last, First MI)': 'Formal format: YBANEZ, JHON LESTER P.',
    '@Full Name (Last, First)': 'Last and First name only: YBANEZ, JHON LESTER',
    '@Middle Name': 'Full middle name: PAYPA',
    '@TIN': 'Tax Identification Number',
    '@Role': 'Job Title/Role',
    '@Department': 'Department name',
    '@Email': 'Email Address',
    '@Join Date': 'Employment Start Date',
    '@Monthly Salary': 'Basic monthly pay',
    '@Holiday Pay': 'Total holiday compensation',
    '@Overtime Pay': 'Total overtime compensation',
    '@Hazard Pay': 'Total hazard pay (usually for MWEs)',
    '@MWE Status': 'Is Minimum Wage Earner? (YES/NO)',
    '@Exempt Bonus': 'Bonus portion within 90k limit',
    '@Taxable Bonus': 'Bonus portion exceeding 90k limit',
    '@Total Contributions': 'Combined SSS, PhilHealth, and Pag-IBIG',
};

// Same categories as Text Template Editor for consistent UI
const FIELD_GROUPS = [
    { label: 'Personal Information', fields: ['@Full Name (First MI Last)', '@Full Name (Last, First MI)', '@Full Name (Last, First)', '@Middle Name', '@TIN', '@Email'] },
    { label: 'Employment Details', fields: ['@Role', '@Department', '@Join Date'] },
    { label: 'Compensation & Earnings', fields: ['@Monthly Salary', '@Holiday Pay', '@Overtime Pay', '@Hazard Pay', '@Exempt Bonus', '@Taxable Bonus'] },
    { label: 'Tax & Contributions', fields: ['@MWE Status', '@Total Contributions'] },
];

export default function DocumentMapper() {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const [fileError, setFileError] = useState(null);
    const [fileSuccess, setFileSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [openGroups, setOpenGroups] = useState(() => FIELD_GROUPS.map(g => g.label));

    const { data, setData, post, processing } = useForm({
        name: '',
        type: 'upload', 
        file: null,
        mappings: [], 
    });

    const toggleGroup = (label) => {
        setOpenGroups(curr => curr.includes(label) ? curr.filter(l => l !== label) : [...curr, label]);
    };

    const filteredGroups = FIELD_GROUPS.map((group) => ({
        ...group,
        fields: group.fields.filter((tag) => {
            const matchTag = tag.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDesc = FIELD_DETAILS[tag]?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchTag || matchDesc;
        }),
    })).filter((group) => searchTerm.trim() === '' ? true : group.fields.length > 0);

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
        if (!selectedFile || selectedFile.type !== 'application/pdf') {
            setFileError("Only PDF files are supported.");
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
        const EDIT_MODE_OFFSET = 5;
        setData('mappings', data.mappings.map(m => m.id === id ? { ...m, x: d.x, y: d.y + EDIT_MODE_OFFSET } : m));
    };

    const removeField = (id) => {
        setData('mappings', data.mappings.filter(m => m.id !== id));
    };

    return (
        <MainLayout>
            <Head title="Upload Document" />

            <PageHeader 
                title="Generate Report"
                backRoute="templates.select"
                steps={[
                    { label: 'Templates', link: '/generate-reports' },
                    { label: 'Select Template', link: '/generate-report/select' },
                    { label: 'Upload Document'}
                ]}
            />
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <ValidationError message={fileError} onClear={() => setFileError(null)} />
                <SuccessMessage message={fileSuccess} onClear={() => setFileSuccess(null)} />

                <div className="flex justify-between items-center mb-8 gap-4">
                    <input 
                        type="text" value={data.name} disabled={showConfirmation}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Template Name (e.g., BIR 2316)..." 
                        className="flex-1 border border-gray-200 rounded-xl focus:ring-green-500 text-sm py-2.5 px-4 font-medium"
                    />

                    <div className="flex gap-3">
                        {!showConfirmation ? (
                            <>
                                <label className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer">
                                    {data.file ? 'Change PDF' : 'Upload PDF'}
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => processFile(e.target.files[0])} />
                                </label>
                                <button type="button" disabled={!data.file || !data.name || data.mappings.length === 0} onClick={() => setShowConfirmation(true)} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-sm">
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

                <div className="flex gap-8 h-[800px]">
                    {!showConfirmation && (
                        <div className="w-[340px] border border-gray-100 rounded-2xl p-5 bg-gray-50/50 flex flex-col shadow-sm h-[600px]">
                            <div className="mb-4">
                                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Available Data Fields</h3>
                                <p className="text-gray-400 text-[10px] italic">Drag fields onto the PDF to map data positions.</p>
                            </div>

                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search fields..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-[11px] focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                                <svg className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin">
                                {filteredGroups.map((group) => (
                                    <div key={group.label} className="space-y-1 bg-white/60 border border-gray-100 rounded-xl px-3 py-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleGroup(group.label)}
                                            className="w-full flex items-center justify-between text-left text-[10px] font-bold text-gray-600 uppercase mb-1"
                                        >
                                            <span>{group.label}</span>
                                            <span className="text-[9px] text-gray-400">
                                                {openGroups.includes(group.label) ? '▾' : '▸'}
                                            </span>
                                        </button>

                                        {openGroups.includes(group.label) && group.fields.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => addField(tag)}
                                                className="w-full text-left mt-1 p-2 bg-green-50 border border-green-100 rounded-lg hover:border-green-500 hover:bg-green-100 transition-all group flex items-center gap-2"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></div>
                                                <div className="min-w-0">
                                                    <p className="text-green-700 font-bold text-[11px]">{tag}</p>
                                                    <p className="text-gray-400 text-[9px] font-medium italic truncate">{FIELD_DETAILS[tag]}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex-1 rounded-[2rem] border-2 border-dashed bg-gray-200 overflow-auto p-8 relative shadow-inner">
                        {previewUrl ? (
                            <div className="relative mx-auto bg-white shadow-2xl" style={{ width: '794px', minHeight: '1123px' }}>
                                <iframe src={`${previewUrl}#toolbar=0&navpanes=0`} className="absolute inset-0 w-full h-full border-none pointer-events-none" />
                                <div className="absolute inset-0 z-10">
                                    {data.mappings.map((m) => {
                                        const isTIN = m.tag.includes('TIN');
                                        const isAmount = m.tag.includes('Salary') || m.tag.includes('Pay') || m.tag.includes('Bonus') || m.tag.includes('Contributions') || m.tag.includes('Earnings');
                                        let displayValue = showConfirmation ? PREVIEW_DATA[m.tag] : m.tag;

                                        if (showConfirmation && isTIN) {
                                            const digits = displayValue.replace(/[^\d]/g, '').split('');
                                            return (
                                                <div key={m.id} className="absolute flex items-center" style={{ left: m.x, top: m.y }}>
                                                    {digits.map((digit, i) => (
                                                        <span key={i} style={{ width: '22.3px', textAlign: 'center', marginRight: (i === 2 || i === 5 || i === 8) ? '8.4px' : '0px', fontFamily: 'monospace', fontSize: '13.33px', fontWeight: 'bold' }}>
                                                            {digit}
                                                        </span>
                                                    ))}
                                                </div>
                                            );
                                        }

                                        return (
                                            <Draggable 
                                                key={m.id} 
                                                bounds="parent" 
                                                disabled={showConfirmation} 
                                                position={{x: m.x, y: showConfirmation ? m.y : m.y - 5}} 
                                                onStop={(e, d) => handleStop(m.id, e, d)}
                                            >
                                                <div 
                                                    className={`absolute flex items-center ${showConfirmation ? 'bg-transparent text-black font-bold text-[13.33px]' : 'p-1 bg-white/90 text-blue-700 border border-blue-400 text-[10px] rounded'}`}
                                                    style={{ 
                                                        fontFamily: 'Helvetica, Arial, sans-serif', 
                                                        whiteSpace: 'nowrap',
                                                        // SIMPLIFIED: No width, no transform.
                                                        width: 'auto',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {displayValue}
                                                    {!showConfirmation && <button onClick={() => removeField(m.id)} className="ml-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px]">✕</button>}
                                                </div>
                                            </Draggable>
                                        
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-32">
                                <p className="font-bold text-sm">Click or Drag & Drop a PDF to start mapping.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}