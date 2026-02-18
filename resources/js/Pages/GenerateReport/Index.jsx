import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PageHeader from '@/Components/PageHeader';


export default function Index({ templates, users }) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleAddUser = (e) => {
        const id = e.target.value;
        if (!id) return;

        const user = users.find(u => u.id === parseInt(id));
        
        if (user && !selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
        
        e.target.value = "";
    };

    const removeUser = (id) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== id));
    };

    const handleGenerate = () => {
        if (selectedUsers.length > 0 && selectedTemplate) {
            selectedUsers.forEach((user, index) => {
                setTimeout(() => {
                    const downloadUrl = route('reports.generate', { 
                        template: selectedTemplate.id, 
                        employee: user.id 
                    });

                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    
                    const fileName = `${user.first_name}_${user.last_name}`;
                    link.setAttribute('download', `Report_${fileName}.pdf`);
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                }, index * 1000); 
            });
        }
    };

    const closeModal = () => {
        setSelectedTemplate(null);
        setSelectedUsers([]); 
    };

    return (
        <MainLayout>
            <Head title="Generate Report" />

            <PageHeader 
                title="Generate Report"
                backRoute="generate-reports.index"
                steps={[
                    { label: 'Templates' }, 
                ]}
            />


            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">List of Templates</h2>
                        <p className="text-gray-400 text-sm">Select a template to generate a report.</p>
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
                                            Maps: {template.field_mappings ? Object.keys(template.field_mappings).length : 0} fields
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
                            <h3 className="text-gray-900 font-bold text-base">No Templates Found</h3>
                            <p className="text-gray-400 text-sm mt-1">Start by creating your first PDF template mapping.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal 
                isOpen={!!selectedTemplate} 
                onClose={closeModal}
                title="Select Employees"
                subtitle={selectedTemplate ? `Generating: ${selectedTemplate.name}` : ''}
                footer={
                    <button 
                        onClick={handleGenerate}
                        disabled={selectedUsers.length === 0}
                        className="flex items-center gap-3 bg-[#636363] text-white px-12 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
                        </svg>
                        Generate PDF
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
                            onChange={handleAddUser}
                            value=""
                        >
                            <option value="" disabled>Select from User List</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedUsers.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-500">Selected for Generation</p>
                            <div className="flex flex-wrap gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                                {selectedUsers.map((u) => (
                                    <div 
                                        key={u.id} 
                                        className="flex items-center gap-2 pl-1 pr-2 py-1 bg-white border border-gray-200 rounded-full shadow-sm"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-[10px] text-white font-bold">
                                            {u.first_name[0]}
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{u.first_name} {u.last_name}</span>
                                        <button 
                                            onClick={() => removeUser(u.id)}
                                            className="ml-1 text-gray-400 hover:text-red-500 font-bold text-lg leading-none"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* RESTORED: Download Format Section */}
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