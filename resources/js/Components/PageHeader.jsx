import React from 'react';
import { Link } from '@inertiajs/react';

const PageHeader = ({ 
    title = "Generate Report", 
    backRoute = null, // Set to null so we can check if it exists
    backText = "Back", // Generic default text
    steps = [] 
}) => {
    return (
        <div className="mb-6">
            {/* ONLY render the back link if backRoute is passed as a prop */}
            {backRoute && (
                <Link
                    href={route(backRoute)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-600 transition mb-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    {backText}
                </Link>
            )}
            
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
            
            <nav className="flex items-center text-sm gap-2 mt-1">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        {step.link ? (
                            <Link href={step.link} className="text-gray-400 hover:text-green-600 transition">
                                {step.label}
                            </Link>
                        ) : (
                            <span className="text-green-600 font-semibold">{step.label}</span>
                        )}
                        {index < steps.length - 1 && <span className="text-gray-400">&gt;</span>}
                    </React.Fragment>
                ))}
            </nav>
        </div>
    );
};

export default PageHeader;