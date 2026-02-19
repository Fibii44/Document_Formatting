import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Header({ title, onToggleSidebar }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayName = user.first_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.email;

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-40 relative">
            <div className="flex items-center">
                <button 
                    onClick={onToggleSidebar}
                    type="button"
                    className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 bg-gray-50 shadow-sm border border-gray-100 focus:outline-none transition-all cursor-pointer relative z-50"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700 tracking-widest uppercase hidden sm:block">
                {title || "INFINITY HUB INTERNS"}
            </div>

            <div className="flex items-center ml-auto relative" ref={dropdownRef}>
                <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition shadow-sm"
                >
                    <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white overflow-hidden border border-white">
                        {/* UPDATE: Use profile_photo_path here instead of signature_path */}
                        {user.profile_photo_path ? (
                            <img src={`/storage/${user.profile_photo_path}`} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    
                    <div className="flex flex-col text-left">
                        <span className="text-[11px] leading-tight font-bold text-gray-700 truncate max-w-[120px]">
                            {displayName}
                        </span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-tighter">
                            {user.role || 'User'}
                        </span>
                    </div>

                    <svg className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manage Account</p>
                        </div>
                        
                        <Link 
                            href={route('profile.edit')}
                            className="flex items-center px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-green-600 transition"
                        >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile & E-Signature
                        </Link>

                        <hr className="my-1 border-gray-50" />

                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button"
                            className="w-full flex items-center px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                        >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}