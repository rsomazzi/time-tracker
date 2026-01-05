import { Head, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export default function Home() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Home" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Time Tracker</h1>
                    <p className="text-lg text-gray-600 mb-8">Professional time tracking and invoicing</p>

                    {auth?.user ? (
                        <a
                            href="/time-tracker"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to Dashboard
                        </a>
                    ) : (
                        <a
                            href="/login"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Get Started
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}
