import React, { useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const PLACEHOLDERS = ['@Employee Name', '@Role', '@Department', '@Email', '@Join Date'];

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
            setData('content', before + tag + after);
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
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Generate Report</h1>
                <nav className="flex items-center text-sm gap-2 mb-2">
                    <Link href="/generate-reports" className="text-gray-400 hover:text-green-600 transition">Templates</Link>
                    <span className="text-gray-400">&gt;</span>
                    <Link href="/generate-report/select" className="text-gray-400 hover:text-green-600 transition">Select Template</Link>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-green-600 font-semibold">Text Editor</span>
                </nav>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6 gap-4">
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Template Name..."
                        className="flex-1 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-sm py-2.5 px-4"
                    />
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2.5 bg-gray-700 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition disabled:opacity-70"
                    >
                        {processing ? 'Saving...' : 'Save Template'}
                    </button>
                </div>

                {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}
                {errors.content && <p className="text-red-500 text-sm mb-2">{errors.content}</p>}

                <div className="flex gap-8">
                    <div className="w-[320px] border border-gray-100 rounded-2xl p-5 bg-gray-50/40 h-fit">
                        <h3 className="font-bold text-gray-800 mb-5 text-sm uppercase tracking-wider">Insert Data Fields</h3>
                        <p className="text-gray-500 text-xs mb-4">Click to insert at cursor in the editor.</p>
                        <div className="space-y-3">
                            {PLACEHOLDERS.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => insertPlaceholder(tag)}
                                    className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-green-500 transition shadow-sm"
                                >
                                    <p className="text-green-600 font-bold text-[11px] uppercase">{tag}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="block font-bold text-gray-800 mb-2 text-sm">Report content</label>
                        <textarea
                            ref={textareaRef}
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            placeholder="Write your report text here. Use the buttons on the left to insert placeholders like @Employee Name, @Role, etc. They will be replaced with real data when generating a report."
                            rows={20}
                            className="w-full border border-gray-200 rounded-2xl p-5 text-sm focus:ring-green-500 focus:border-green-500 resize-y min-h-[400px]"
                        />
                    </div>
                </div>
            </form>
        </MainLayout>
    );
}
