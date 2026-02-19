import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function UpdateSignatureForm({ className = '', signatureUrl }) {
    // Initial preview from the backend prop
    const [preview, setPreview] = useState(signatureUrl);
    const fileInput = useRef();

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        signature: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.signature.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">E-Signature Asset</h2>
                    <p className="text-sm text-gray-500">
                        Upload a transparent PNG to authorize payroll reports.
                    </p>
                </div>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                    {/* Glass-morphism Preview Area */}
                    <div 
                        onClick={() => fileInput.current.click()}
                        className="group relative w-64 h-32 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50/50 cursor-pointer hover:bg-white hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                        {preview ? (
                            <div className="relative w-full h-full p-4">
                                <img src={preview} alt="Signature Preview" className="w-full h-full object-contain filter drop-shadow-sm" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-[2px]">
                                    Change Asset
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select PNG</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            Format: PNG (Transparent)
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            Usage: BIR 2316 & Reports
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-[200px] italic">
                            Tip: A clean, black-ink scan works best.
                        </p>
                    </div>

                    <input
                        type="file"
                        ref={fileInput}
                        className="hidden"
                        accept="image/png"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setData('signature', file);
                                setPreview(URL.createObjectURL(file));
                            }
                        }}
                    />
                </div>

                {errors.signature && (
                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.signature}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button 
                        disabled={processing}
                        className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest hover:bg-black hover:shadow-lg active:scale-95 transition-all disabled:opacity-25"
                    >
                        {processing ? 'Processing...' : 'Apply Signature'}
                    </button>

                    {recentlySuccessful && (
                        <div className="flex items-center gap-2 text-green-600 animate-in fade-in slide-in-from-left-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-wider">Saved Successfully</span>
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
}