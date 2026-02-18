import React, { useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

// Synced with DocumentMapper and HasReportMapping Trait
const PLACEHOLDERS = [
    '@Full Name (First MI Last)',
    '@Full Name (Last, First MI)',
    '@Full Name (Last, First)',
    '@TIN',
    '@Role',
    '@Department',
    '@Email',
    '@Join Date',
    '@Monthly Salary',
    '@Holiday Pay',
    '@Overtime Pay',
    '@Hazard Pay',
    '@MWE Status',
    '@Exempt Bonus',
    '@Taxable Bonus',
    '@Total Contributions',
];

export default function TextTemplateEditor() {
    const textareaRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'text',
        content: '',
    });

    const insertPlaceholder = (tag) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const before = data.content.slice(0, start);
            const after = data.content.slice(end);
            
            // Insert tag at cursor position
            setData('content', before + tag + after);
            
            // Refocus textarea after state update
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + tag.length, start + tag.length);
            }, 0);
        } else {
            setData('content', data.content + tag);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('templates.save'));
    };

    return (
        <MainLayout>
            <Head title="Text Template Editor" />

            <PageHeader 
                title="Generate Report"
                backRoute="templates.select"
                steps={[
                    { label: 'Templates', link: route('generate-reports.index') },
                    { label: 'Select Template', link: route('templates.select') },
                    { label: 'Text Editor'}
                ]}
            />

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6 gap-4">
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Template Name (e.g., Employment Certification)..."
                        className="flex-1 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-sm py-2.5 px-4 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition shadow-sm disabled:opacity-70"
                    >
                        {processing ? 'Saving...' : 'Save Template'}
                    </button>
                </div>

                {errors.name && <p className="text-red-500 text-xs mb-2 ml-2 font-bold">{errors.name}</p>}
                {errors.content && <p className="text-red-500 text-xs mb-2 ml-2 font-bold">{errors.content}</p>}

                <div className="flex gap-8">
                    {/* Sidebar: Data Fields */}
                    <div className="w-[340px] border border-gray-100 rounded-2xl p-5 bg-gray-50/50 flex flex-col shadow-sm h-[600px]">
                        <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wider">Insert Data Fields</h3>
                        <p className="text-gray-400 text-[10px] mb-4 italic">Click a field to insert it into your report at the cursor position.</p>
                        
                        <div className="space-y-2 overflow-y-auto pr-2 scrollbar-thin">
                            {PLACEHOLDERS.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => insertPlaceholder(tag)}
                                    className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all group"
                                >
                                    <p className="text-green-600 font-bold text-[11px] group-hover:text-green-700">{tag}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Editor */}
                    <div className="flex-1">
                        <label className="block font-bold text-gray-800 mb-2 text-sm">Report Content Editor</label>
                        <textarea
                            ref={textareaRef}
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            placeholder="Type your report content here. Use the fields on the left to personalize the report for each employee."
                            className="w-full border border-gray-200 rounded-[1.5rem] p-6 text-sm focus:ring-green-500 focus:border-green-500 resize-none min-h-[600px] shadow-inner leading-relaxed"
                        />
                        <div className="mt-2 flex justify-between text-[10px] text-gray-400 font-medium px-2">
                            <span>Format: Standard Paragraphs</span>
                            <span>Characters: {data.content.length}</span>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayout>
    );
}