import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ReviewTemplate({ template }) {
    // 1. Fetch current logged-in user data
    const { auth } = usePage().props;
    const user = auth.user;

    // 2. Resolve the dynamic signature path
    const currentSignature = user.signature_path 
        ? `/storage/${user.signature_path}` 
        : '/images/sample-signature.png';

    // 3. Updated PREVIEW_DATA with the CORRECT TAG mapping
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
        '@E-Signature': currentSignature, // Ensure this tag matches your mapper
    };

    // Normalize mappings for Upload type
    const mappings = Array.isArray(template.field_mappings) 
        ? template.field_mappings 
        : Object.values(template.field_mappings || {});

    // Helper to process Text Template content with preview data
    const getProcessedContent = () => {
        let content = template.content || '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const spans = doc.querySelectorAll('span[data-placeholder]');
        
        spans.forEach(span => {
            const tag = span.getAttribute('data-placeholder');
            const displayValue = PREVIEW_DATA[tag] || tag;

            // Handle e-signature image in text templates
            if (tag === '@E-Signature') {
                span.innerHTML = `<img src="${displayValue}" style="height: 40px; vertical-align: middle;" />`;
            } else {
                span.textContent = displayValue;
                span.style.color = '#15803d';
                span.style.fontWeight = 'bold';
            }
        });

        let finalHtml = doc.body.innerHTML;
        Object.entries(PREVIEW_DATA).forEach(([tag, value]) => {
            if (tag === '@E-Signature') return; // Skip image tags for string replacement
            const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedTag, 'g');
            finalHtml = finalHtml.replace(regex, value);
        });

        return finalHtml;
    };

    return (
        <MainLayout>
            <Head title={`Review - ${template.name}`} />

            <div className="flex flex-col h-[calc(100vh-4rem)] -m-8 overflow-hidden bg-[#121212]">
                
                {/* TOP TOOLBAR */}
                <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-30 shadow-md">
                    <div className="flex items-center gap-6">
                        <Link href={route('generate-reports.index')} className="flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                            Exit Review
                        </Link>
                        <div className="h-6 w-[1px] bg-gray-200" />
                        <div>
                            <h2 className="text-lg font-black text-gray-900 leading-none uppercase tracking-tighter italic">{template.name}</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                {template.type === 'text' ? 'Content & Style Review' : 'Layout & Mapping Validation'}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Preview Mode Only
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    
                    {/* LEFT: THE CANVAS */}
                    <div className="flex-1 overflow-auto p-16 flex justify-center custom-scrollbar">
                        <div 
                            className="relative bg-white shadow-[0_0_100px_rgba(0,0,0,0.8)] mb-32 flex-shrink-0"
                            style={{ width: '794px', height: '1248px' }}
                        >
                            {template.type === 'text' ? (
                                <div className="p-[20mm] h-full overflow-hidden text-gray-800 break-words">
                                    <div 
                                        className="prose prose-sm max-w-none preview-content"
                                        style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '12pt', lineHeight: '1.6' }}
                                        dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <iframe 
                                        src={`/storage/${template.file_path}#toolbar=0&navpanes=0&view=FitH`} 
                                        className="absolute inset-0 w-full h-full border-none" 
                                        style={{ pointerEvents: 'none' }}
                                    />
                                    <div className="absolute inset-0 z-20 pointer-events-none">
                                        {mappings.map((m, index) => {
                                            const displayValue = PREVIEW_DATA[m.tag] || m.tag;
                                            const isSignature = m.tag?.includes('Signature');

                                            if (m.tag?.includes('TIN')) {
                                                const digits = displayValue.replace(/[^\d]/g, '').split('');
                                                return (
                                                    <div key={index} className="absolute flex items-center" style={{ left: `${m.x}px`, top: `${m.y}px` }}>
                                                        {digits.map((digit, i) => (
                                                            <span key={i} style={{ width: '22.3px', textAlign: 'center', marginRight: (i === 2 || i === 5 || i === 8) ? '8.4px' : '0px', fontFamily: 'monospace', fontSize: '13.33px', fontWeight: 'bold', color: 'black' }}>{digit}</span>
                                                        ))}
                                                    </div>
                                                );
                                            }

                                            // RENDERING SIGNATURE AS IMAGE
                                            if (isSignature) {
                                                return (
                                                    <div key={index} className="absolute" style={{ left: `${m.x}px`, top: `${m.y}px` }}>
                                                        <img 
                                                            src={displayValue} 
                                                            alt="User Signature" 
                                                            style={{ height: '50px', width: 'auto', objectFit: 'contain' }} 
                                                        />
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div key={index} className="absolute font-bold text-[13.33px] text-black whitespace-nowrap" style={{ left: `${m.x}px`, top: `${m.y}px`, fontFamily: 'Helvetica, Arial, sans-serif' }}>
                                                    {displayValue}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: CONTROL PANEL */}
                    <div className="w-96 bg-white border-l border-gray-100 p-8 flex flex-col shadow-2xl z-20">
                        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                                    {template.type === 'text' ? 'Active Placeholders' : `Mapped Fields (${mappings.length})`}
                                </h4>
                                <div className="space-y-2">
                                    {template.type === 'text' ? (
                                        Object.keys(PREVIEW_DATA).map((tag, i) => (
                                            template.content?.includes(tag) && (
                                                <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-green-50 bg-green-50/30">
                                                    <span className="text-[11px] font-bold text-green-700">{tag}</span>
                                                    <span className="text-[9px] font-black text-green-400 uppercase">Active</span>
                                                </div>
                                            )
                                        ))
                                    ) : (
                                        mappings.map((m, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-green-200 transition group">
                                                <span className="text-[11px] font-bold text-gray-600">{m.tag}</span>
                                                <span className="text-[9px] font-mono text-gray-300 group-hover:text-green-500">{Math.round(m.x)}, {Math.round(m.y)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        <div className="pt-8 border-t border-gray-100 mt-auto">
                            <Link 
                                href={route('generate-reports.index')} 
                                className="flex items-center justify-center w-full py-4 bg-[#469a21] hover:bg-green-700 text-white rounded-2xl font-bold text-sm shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                Done Reviewing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .preview-content p { margin-bottom: 1em; }
                .preview-content b, .preview-content strong { font-weight: bold; }
                .preview-content i, .preview-content em { font-style: italic; }
                .preview-content u { text-decoration: underline; }
            `}</style>
        </MainLayout>
    );
}