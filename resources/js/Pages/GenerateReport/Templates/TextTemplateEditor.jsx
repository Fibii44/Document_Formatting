import React, { useRef, useState, useMemo } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

// 1. Import Quill and styles
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// 2. Define the Atomic Pill (Embed Blot)
// This ensures the placeholder is treated as a single "block" character.
const Embed = Quill.import('blots/embed');
class PlaceholderBlot extends Embed {
    static create(value) {
        let node = super.create();
        node.setAttribute('data-placeholder', value);
        node.setAttribute('contenteditable', 'false');
        node.innerHTML = value;
        // Applying styles directly for safety/integrity
        node.classList.add('data-pill-inline');
        return node;
    }
    static value(node) {
        return node.getAttribute('data-placeholder');
    }
}
PlaceholderBlot.blotName = 'placeholder';
PlaceholderBlot.tagName = 'span';
Quill.register(PlaceholderBlot);

const PLACEHOLDER_GROUPS = [
    {
        label: 'Personal Information',
        fields: ['@Full Name (First MI Last)', '@Full Name (Last, First MI)', '@Full Name (Last, First)', '@Middle Name', '@TIN', '@Email'],
    },
    {
        label: 'Employment Details',
        fields: ['@Role', '@Department', '@Join Date'],
    },
    {
        label: 'Compensation & Earnings',
        fields: ['@Monthly Salary', '@Holiday Pay', '@Overtime Pay', '@Hazard Pay', '@Exempt Bonus', '@Taxable Bonus'],
    },
    {
        label: 'Tax & Contributions',
        fields: ['@MWE Status', '@Total Contributions'],
    },
];

export default function TextTemplateEditor() {
    const quillRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [openGroups, setOpenGroups] = useState(() => PLACEHOLDER_GROUPS.map(g => g.label));

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'text',
        content: '', 
    });

    // --- Sidebar Logic ---
    const toggleGroup = (label) => {
        setOpenGroups(curr => curr.includes(label) ? curr.filter(l => l !== label) : [...curr, label]);
    };

    const filteredGroups = PLACEHOLDER_GROUPS.map((group) => ({
        ...group,
        fields: group.fields.filter((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    })).filter((group) => searchTerm.trim() === '' ? true : group.fields.length > 0);

    // --- Safety Rail: Insert Atomic Placeholder ---
    const insertPlaceholder = (tag) => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true); 

        // Insert as an atomic Blot
        quill.insertEmbed(range.index, 'placeholder', tag);
        // Move cursor and insert a space for better UX
        quill.insertText(range.index + 1, ' ');
        quill.setSelection(range.index + 2);
    };

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ],
    }), []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('templates.save'));
    };

    return (
        <MainLayout>
            <Head title="Text Template Editor" />

            <PageHeader 
                title="Template Editor"
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

                <div className="flex gap-8">
                    {/* Sidebar: Protected Data Fields */}
                    <div className="w-[340px] border border-gray-100 rounded-2xl p-5 bg-gray-50/50 flex flex-col shadow-sm h-[600px]">
                        <div className="mb-4">
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Data Integrity Fields</h3>
                            <p className="text-gray-400 text-[10px] italic">Locked fields ensure error-free report generation.</p>
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
                                            onClick={() => insertPlaceholder(tag)}
                                            className="w-full text-left mt-1 p-2 bg-green-50 border border-green-100 rounded-lg hover:border-green-500 hover:bg-green-100 transition-all group flex items-center gap-2"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                            <p className="text-green-700 font-bold text-[11px]">{tag}</p>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Quill Editor */}
                    <div className="flex-1">
                        <label className="block font-bold text-gray-800 mb-2 text-sm">Report Content Editor</label>
                        <div className="quill-container-custom">
                            <ReactQuill
                                theme="snow"
                                ref={quillRef}
                                value={data.content}
                                onChange={(val) => setData('content', val)}
                                modules={modules}
                                placeholder="Draft your professional template here..."
                            />
                        </div>
                        <div className="mt-2 flex justify-between text-[10px] text-gray-400 font-medium px-2">
                            <span>Format: Safety-Locked Template (HTML)</span>
                            <span>Characters: {data.content.length}</span>
                        </div>
                    </div>
                </div>
            </form>

            <style jsx global>{`
                /* UI Styling for the Editor */
                .quill-container-custom .ql-toolbar {
                    border-top-left-radius: 1.5rem;
                    border-top-right-radius: 1.5rem;
                    border-color: #f3f4f6;
                    background: #f9fafb;
                    padding: 12px;
                }
                .quill-container-custom .ql-container {
                    border-bottom-left-radius: 1.5rem;
                    border-bottom-right-radius: 1.5rem;
                    border-color: #f3f4f6;
                    min-height: 500px;
                    font-family: 'Inter', sans-serif;
                }
                .quill-container-custom .ql-editor {
                    min-height: 500px;
                    font-size: 0.875rem;
                    line-height: 1.6;
                    padding: 2rem;
                }

                /* The Atomic Pill Style */
                .data-pill-inline {
                    display: inline-block;
                    background-color: #dcfce7;
                    color: #15803d;
                    padding: 2px 10px;
                    border-radius: 9999px;
                    font-weight: 700;
                    border: 1px solid #bbf7d0;
                    font-size: 11px;
                    margin: 0 4px;
                    vertical-align: baseline;
                    user-select: none;
                    cursor: default;
                }
                .data-pill-inline:hover {
                    border-color: #22c55e;
                    background-color: #f0fdf4;
                }
            `}</style>
        </MainLayout>
    );
}