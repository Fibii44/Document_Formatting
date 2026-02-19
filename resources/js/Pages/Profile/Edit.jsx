import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import EditSignature from "./Partials/UpdateSignatureForm";

export default function Edit({ mustVerifyEmail, status, signatureUrl }) {
    return (
        <AuthenticatedLayout
           
        >
            <Head title="Profile Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    
                    {/* 1. Signature Asset Section */}
                    <div className="bg-white p-4 shadow sm:rounded-2xl sm:p-8 border border-gray-100">
                        <EditSignature signatureUrl={signatureUrl} />
                    </div>

                    {/* 2. Profile Information */}
                    <div className="bg-white p-4 shadow sm:rounded-2xl sm:p-8 border border-gray-100">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* 3. Password Security */}
                    <div className="bg-white p-4 shadow sm:rounded-2xl sm:p-8 border border-gray-100">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* 4. Danger Zone */}
                    <div className="bg-white p-4 shadow sm:rounded-2xl sm:p-8 border border-red-50">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}