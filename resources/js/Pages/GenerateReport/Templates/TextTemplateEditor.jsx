import React, { useRef, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

// Synced with DocumentMapper and HasReportMapping Trait
const PLACEHOLDER_GROUPS = [
    {
        label: 'Personal Information',
        fields: [
            '@Full Name (First MI Last)',
            '@Full Name (Last, First MI)',
            '@Full Name (Last, First)',
            '@Middle Name',
            '@TIN',
            '@Email',
        ],
    },
    {
        label: 'Employment Details',
        fields: [
            '@Role',
            '@Department',
            '@Join Date',
        ],
    },
    {
        label: 'Compensation & Earnings',
        fields: [
            '@Monthly Salary',
            '@Holiday Pay',
            '@Overtime Pay',
            '@Hazard Pay',
            '@Exempt Bonus',
            '@Taxable Bonus',
        ],
    },
    {
        label: 'Tax & Contributions',
        fields: [
            '@MWE Status',
            '@Total Contributions',
        ],
    },
];

export default function TextTemplateEditor() {
    const textareaRef = useRef(null);
    const [openGroups, setOpenGroups] = useState(
        () => PLACEHOLDER_GROUPS.map(group => group.label) // all open by default
    );
    const [searchTerm, setSearchTerm] = useState('');

    const toggleGroup = (label) => {
        setOpenGroups((current) =>
            current.includes(label)
                ? current.filter((l) => l !== label)
                : [...current, label]
        );
    };

    const filteredGroups = PLACEHOLDER_GROUPS.map((group) => ({
        ...group,
        fields: group.fields.filter((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    })).filter((group) =>
        searchTerm.trim() === '' ? true : group.fields.length > 0
    );

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
                        <h3 className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wider">Insert Data Fields</h3>
                        <p className="text-gray-400 text-[10px] mb-4 italic">
                            1) Choose a category, 2) Click a green item to insert it into your letter.
                        </p>

                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search data fields (e.g. salary, name)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-[11px] focus:ring-green-500 focus:border-green-500 bg-white"
                            />
                            <svg
                                className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        
                        <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin">
                            {filteredGroups.map((group) => (
                                <div key={group.label} className="space-y-1 bg-white/60 border border-gray-100 rounded-xl px-3 py-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleGroup(group.label)}
                                        className="w-full flex items-center justify-between text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1"
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
                                            className="w-full text-left mt-1 p-2.5 bg-green-50 border border-green-100 rounded-lg hover:border-green-500 hover:bg-green-100 hover:shadow-md transition-all group"
                                        >
                                            <p className="text-green-700 font-bold text-[11px] group-hover:text-green-800">
                                                {tag}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ))}

                            {filteredGroups.length === 0 && (
                                <p className="text-[11px] text-gray-400 italic mt-4">
                                    No data fields match your search. Try a different word.
                                </p>
                            )}
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