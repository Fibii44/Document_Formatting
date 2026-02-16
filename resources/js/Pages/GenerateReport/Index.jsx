import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function Index({ templates, employees }) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    // Changed to an array to handle multiple selections
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const handleAddEmployee = (e) => {
        const id = e.target.value;
        if (!id) return;

        const employee = employees.find(emp => emp.id === parseInt(id));
        
        // Add only if not already selected
        if (employee && !selectedEmployees.some(emp => emp.id === employee.id)) {
            setSelectedEmployees([...selectedEmployees, employee]);
        }
        
        // Reset dropdown so user can select another
        e.target.value = "";
    };

    const removeEmployee = (id) => {
        setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== id));
    };

    const handleGenerate = () => {
        if (selectedEmployees.length > 0 && selectedTemplate) {
            // For multiple employees, we trigger downloads in a loop
            selectedEmployees.forEach((emp, index) => {
                setTimeout(() => {
                    window.open(route('reports.generate', { 
                        template: selectedTemplate.id, 
                        employee: emp.id 
                    }), '_blank');
                }, index * 500); // Staggered to prevent browser blocking multiple popups
            });
        }
    };

    const closeModal = () => {
        setSelectedTemplate(null);
        setSelectedEmployees([]); // Clear selection on close
    };

    return (
        <MainLayout>
            <Head title="Generate Report" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Generate Report</h1>
                <p className="text-green-600 text-sm font-semibold">Templates</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">List of Templates</h2>
                        <p className="text-gray-400 text-sm">List of Templates that can be used.</p>
                    </div>
                    
                    <Link 
                        href={route('templates.select')} 
                        className="flex items-center bg-[#469a21] hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition shadow-sm"
                    >
                        <span className="mr-2 text-xl leading-none">+</span>
                        New Template
                    </Link>
                </div>

                <div className="min-h-[400px] border border-gray-200 rounded-[2rem] p-8 bg-white">
                    {templates && templates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {templates.map((template) => (
                                <button 
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className="group relative text-left block aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-[#469a21] to-[#e7b422] p-6 text-white shadow-lg transition-transform hover:-translate-y-1"
                                >
                                    <div className="mb-4 inline-block rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                                        <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold leading-tight mb-1">{template.name}</h3>
                                    <p className="text-xs font-medium opacity-90 mb-6 uppercase tracking-wider">Type : {template.type}</p>
                                    <div className="mt-auto">
                                        <p className="text-[10px] font-semibold opacity-80 uppercase tracking-widest">
                                            Coordinated Maps: {template.field_mappings ? Object.keys(template.field_mappings).length : 0} fields
                                        </p>
                                        <p className="text-[10px] font-semibold opacity-60">
                                            Created: {new Date(template.created_at).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="bg-[#333] p-4 rounded-xl mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <h3 className="text-gray-900 font-bold text-base">No Templates Yet</h3>
                            <p className="text-gray-400 text-sm mt-1">Start by creating your first report template</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal 
                isOpen={!!selectedTemplate} 
                onClose={closeModal}
                title="Select an Employee"
                subtitle={selectedTemplate ? `Generate report for ${selectedTemplate.name}` : ''}
                footer={
                    <button 
                        onClick={handleGenerate}
                        disabled={selectedEmployees.length === 0}
                        className="flex items-center gap-3 bg-[#636363] text-white px-12 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
                        </svg>
                        Generate
                    </button>
                }
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Add Employee
                        </label>
                        <select 
                            className="w-full border-gray-200 rounded-xl p-3 text-sm focus:ring-green-500"
                            onChange={handleAddEmployee}
                            value=""
                        >
                            <option value="" disabled>Select an Employee</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Frame 63 Style: Selected Employees Chip Area */}
                    {selectedEmployees.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-500">Selected Employee</p>
                            <div className="flex flex-wrap gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                                {selectedEmployees.map((emp) => (
                                    <div 
                                        key={emp.id} 
                                        className="flex items-center gap-2 pl-1 pr-2 py-1 bg-white border border-gray-200 rounded-full shadow-sm"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{emp.full_name}</span>
                                        <button 
                                            onClick={() => removeEmployee(emp.id)}
                                            className="ml-1 text-gray-400 hover:text-red-500 font-bold text-lg"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <div className="text-[10px] text-gray-400 border border-dashed border-gray-300 rounded-lg px-2 py-1.5 flex items-center">
                                    Add more +
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4" />
                            </svg>
                            Download Format
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 border-2 border-green-600 text-gray-800 p-3 rounded-xl font-bold text-xs bg-green-50/50">
                                <span className="text-red-600 font-black">A</span> PDF Document
                            </button>
                            <button disabled className="flex items-center justify-center gap-2 border border-gray-200 text-gray-300 p-3 rounded-xl font-bold text-xs cursor-not-allowed">
                                <span className="text-green-500 opacity-50">X</span> Excel / CSV
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </MainLayout>
    );
}