import React, { useRef, useState, useEffect } from 'react';
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
    const editorRef = useRef(null);
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

    const buildPlainContentFromEditor = () => {
        const editor = editorRef.current;
        if (!editor) return;

        const walk = (node) => {
            let text = '';
            node.childNodes.forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    text += child.textContent;
                } else if (
                    child.nodeType === Node.ELEMENT_NODE &&
                    child.hasAttribute('data-placeholder')
                ) {
                    text += child.getAttribute('data-placeholder');
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    text += walk(child);
                }
            });
            return text;
        };

        const plain = walk(editor);
        setData('content', plain);
    };

    const handleEditorInput = () => {
        buildPlainContentFromEditor();
    };

    const insertPlaceholder = (tag) => {
        const editor = editorRef.current;
        if (!editor) {
            setData('content', data.content + tag);
            return;
        }

        editor.focus();

        const selection = window.getSelection();
        if (!selection) return;

        let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        if (!range || !editor.contains(range.commonAncestorContainer)) {
            range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
        }

        const pill = document.createElement('span');
        pill.setAttribute('data-placeholder', tag);
        pill.contentEditable = 'false';
        pill.className =
            'inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[11px] font-bold border border-green-300 align-middle mx-[1px]';
        pill.textContent = tag;

        range.insertNode(pill);

        // Move cursor after pill
        const space = document.createTextNode(' ');
        pill.after(space);
        range.setStartAfter(space);
        range.setEndAfter(space);
        selection.removeAllRanges();
        selection.addRange(range);

        buildPlainContentFromEditor();
    };

    useEffect(() => {
        if (editorRef.current && data.content && editorRef.current.innerText.trim() === '') {
            editorRef.current.innerText = data.content;
        }
    }, [data.content]);

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
                        <div
                            ref={editorRef}
                            contentEditable
                            onInput={handleEditorInput}
                            data-placeholder="Type your report content here. Use the fields on the left to personalize the report for each employee."
                            className="w-full border border-gray-200 rounded-[1.5rem] p-6 text-sm focus:ring-green-500 focus:border-green-500 min-h-[600px] shadow-inner leading-relaxed outline-none whitespace-pre-wrap"
                            role="textbox"
                            aria-multiline="true"
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