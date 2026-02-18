import React from 'react';
import { Link } from '@inertiajs/react';

const PageHeader = ({ 
    title = "Generate Report", 
    backRoute = 'templates.select', 
    backText = "Back to Select Template",
    steps = [] // Pass an array of steps like [{label: 'Templates', link: '/reports'}, {label: 'Visual Mapper'}]
}) => {
    return (
        <div className="mb-6">
            <Link
                href={route(backRoute)}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-600 transition mb-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                {backText}
            </Link>
            
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
            
            <nav className="flex items-center text-sm gap-2 mb-2">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        {step.link ? (
                            <Link href={step.link} className="text-gray-400 hover:text-green-600 transition">
                                {step.label}
                            </Link>
                        ) : (
                            <span className="text-green-600 font-semibold">{step.label}</span>
                        )}
                        {/* Only show the divider if it's not the last step */}
                        {index < steps.length - 1 && <span className="text-gray-400">&gt;</span>}
                    </React.Fragment>
                ))}
            </nav>
        </div>
    );
};

export default PageHeader;