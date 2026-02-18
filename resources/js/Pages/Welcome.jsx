import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome | Document Formatting System" />
            <div className="bg-gray-50 text-black min-h-screen selection:bg-green-100">
                {/* Background Pattern - Subtle and Professional */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#16a34a 1px, transparent 1px)', size: '20px 20px' }}></div>

                {/* Main Container lowered from the top for better breathing room */}
                <div className="relative flex flex-col items-center min-h-screen px-6 pt-16">
                    <div className="w-full max-w-4xl">
                        
                        {/* Header Navigation - Balanced and Centered */}
                        <header className="flex justify-between items-center mb-12 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-green-600 p-2.5 rounded-xl shadow-lg shadow-green-200">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-black text-gray-800 tracking-tighter uppercase">
                                    FORMATTING <span className="text-green-600 italic font-medium">MODULE</span>
                                </span>
                            </div>

                            <nav className="flex items-center gap-6">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all">Go to Dashboard</Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="text-gray-500 font-bold text-sm hover:text-green-600 transition-colors uppercase tracking-wider">Log in</Link>
                                        <Link href={route('register')} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">Get Started</Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        {/* Main Hero Card */}
                        <main className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="relative z-10 max-w-2xl">
                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-8 border border-green-100">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Advanced Document Management
                                </div>

                                <h1 className="text-6xl font-black text-gray-800 leading-[1] mb-6 tracking-tight">
                                    Automated Document <span className="text-green-600 italic underline underline-offset-8 decoration-green-200">Formatting</span> & Mapping
                                </h1>

                                <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                                    An intelligent solution to manage complex document templates, 
                                    map variable data visually onto existing layouts, and generate professional reports instantly.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <Link href={route('register')} className="px-10 py-4 bg-gray-900 text-white rounded-2xl text-base font-bold hover:scale-105 transition-all shadow-2xl shadow-gray-200">
                                        Start Formatting
                                    </Link>
                                    <a href="#features" className="px-10 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl text-base font-bold hover:bg-gray-50 hover:text-gray-800 transition-all">
                                        Learn More
                                    </a>
                                </div>
                            </div>

                            {/* Decorative Background Element - Consistent with Visual Mapper Style */}
                            <div className="absolute right-[-5%] top-[-10%] opacity-[0.03] select-none pointer-events-none">
                                <svg className="w-[500px] h-[500px]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </main>

                        {/* Quick Module Capabilities */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
                                <div className="bg-blue-50 p-3.5 rounded-2xl text-blue-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">Visual Mapper</h4>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Precise field mapping</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
                                <div className="bg-green-50 p-3.5 rounded-2xl text-green-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">PDF Processing</h4>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Layout Calibration</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
                                <div className="bg-purple-50 p-3.5 rounded-2xl text-purple-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">Dynamic Storage</h4>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Scalable Database</p>
                                </div>
                            </div>
                        </div>

                        <footer className="mt-20 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] pb-12">
                            Formatting System · Report Engine · 2026
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}