import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Draggable from 'react-draggable';
import ValidationError from '@/Components/ValidationError';
import SuccessMessage from '@/Components/SuccessMessage';
import PageHeader from '@/Components/PageHeader';

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
    '@E-Signature': 'Digital signature of the authorized representative',
};

const FIELD_GROUPS = [
    { label: 'Personal Information', fields: ['@Full Name (First MI Last)', '@Full Name (Last, First MI)', '@Full Name (Last, First)', '@Middle Name', '@TIN', '@Email'] },
    { label: 'Employment Details', fields: ['@Role', '@Department', '@Join Date'] },
    { label: 'Compensation & Earnings', fields: ['@Monthly Salary', '@Holiday Pay', '@Overtime Pay', '@Hazard Pay', '@Exempt Bonus', '@Taxable Bonus'] },
    { label: 'Tax & Contributions', fields: ['@MWE Status', '@Total Contributions'] },
    { label: 'Authorization', fields: ['@E-Signature'] },
];

export default function DocumentMapper() {
    // 1. Fetch current logged-in user data
    const { auth } = usePage().props;
    const user = auth.user;

    // 2. Dynamically resolve the signature path
    const currentSignature = user.signature_path 
        ? `/storage/${user.signature_path}` 
        : '/images/sample-signature.png';

    const [previewUrl, setPreviewUrl] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [fileError, setFileError] = useState(null);
    const [fileSuccess, setFileSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [openGroups, setOpenGroups] = useState(() => FIELD_GROUPS.map(g => g.label));

    // 3. Updated PREVIEW_DATA with dynamic signature
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
        '@E-Signature': currentSignature, // Fetched from user record
    };

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

    useEffect(() => {
        if (!data.file) { setPreviewUrl(null); return; }
        const objectUrl = URL.createObjectURL(data.file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [data.file]);

    const addField = (tag) => {
        setData('mappings', [...data.mappings, { id: Date.now(), tag, x: 20, y: 20 }]);
    };

    const handleStop = (id, e, d) => {
        setData('mappings', data.mappings.map(m => m.id === id ? { ...m, x: d.x, y: d.y } : m));
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
            
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
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

                <div className="flex gap-8 h-[80vh]">
                    {!showConfirmation && (
                        <div className="w-[340px] border border-gray-100 rounded-2xl p-5 bg-gray-50/50 flex flex-col shadow-sm h-full overflow-hidden">
                            <div className="mb-4">
                                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Available Data Fields</h3>
                            </div>

                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search fields..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-[11px] focus:ring-green-500 bg-white"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {filteredGroups.map((group) => (
                                    <div key={group.label} className="space-y-1 bg-white/60 border border-gray-100 rounded-xl px-3 py-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleGroup(group.label)}
                                            className="w-full flex items-center justify-between text-left text-[10px] font-bold text-gray-600 uppercase mb-1"
                                        >
                                            <span>{group.label}</span>
                                            <span>{openGroups.includes(group.label) ? '▾' : '▸'}</span>
                                        </button>

                                        {openGroups.includes(group.label) && group.fields.map((tag) => {
                                            const isSig = tag.includes('Signature');
                                            return (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => addField(tag)}
                                                    className={`w-full text-left mt-1 p-2 border rounded-lg transition-all flex items-center gap-2 ${
                                                        isSig 
                                                        ? 'bg-purple-50 border-purple-100 hover:border-purple-500 hover:bg-purple-100' 
                                                        : 'bg-green-50 border-green-100 hover:border-green-500 hover:bg-green-100'
                                                    }`}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSig ? 'bg-purple-400' : 'bg-green-400'}`}></div>
                                                    <p className={`font-bold text-[11px] ${isSig ? 'text-purple-700' : 'text-green-700'}`}>{tag}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex-1 rounded-[2rem] border-2 border-dashed bg-gray-200 overflow-y-auto p-12 relative shadow-inner h-full custom-scrollbar flex justify-center">
                        {previewUrl ? (
                            <div className="relative bg-white shadow-2xl mb-32 flex-shrink-0" style={{ width: '794px', height: '1248px' }}>
                                <iframe 
                                    src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH`} 
                                    className="absolute inset-0 w-full h-full border-none" 
                                    style={{ pointerEvents: 'none' }} 
                                />
                                
                                <div className="absolute inset-0 z-10">
                                    {data.mappings.map((m) => {
                                        const isTIN = m.tag.includes('TIN');
                                        const isSignature = m.tag.includes('Signature');
                                        let displayValue = showConfirmation ? PREVIEW_DATA[m.tag] : m.tag;

                                        // CASE 1: TIN Digits
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

                                        // CASE 2: User Signature
                                        if (showConfirmation && isSignature) {
                                            return (
                                                <div key={m.id} className="absolute" style={{ left: m.x, top: m.y }}>
                                                    <img 
                                                        src={displayValue} 
                                                        alt="User Signature" 
                                                        style={{ height: '50px', width: 'auto', objectFit: 'contain' }} 
                                                    />
                                                </div>
                                            );
                                        }

                                        // CASE 3: Draggable Placeholders
                                        return (
                                            <Draggable 
                                                key={m.id} 
                                                bounds="parent" 
                                                disabled={showConfirmation} 
                                                position={{x: m.x, y: m.y}} 
                                                onStop={(e, d) => handleStop(m.id, e, d)}
                                            >
                                                <div 
                                                    className={`absolute cursor-move flex items-center ${
                                                        showConfirmation 
                                                        ? 'bg-transparent text-black font-bold text-[13.33px]' 
                                                        : isSignature
                                                            ? 'p-1 bg-purple-100 text-purple-700 border border-purple-400 text-[10px] rounded shadow-sm'
                                                            : 'p-1 bg-white/95 text-blue-700 border border-blue-400 text-[10px] rounded shadow-sm'
                                                    }`}
                                                    style={{ fontFamily: 'Helvetica, Arial, sans-serif', whiteSpace: 'nowrap' }}
                                                >
                                                    {displayValue}
                                                    {!showConfirmation && (
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); removeField(m.id); }} 
                                                            className="ml-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] hover:bg-red-600"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </Draggable>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p className="font-bold text-sm">Upload a PDF to start mapping.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}