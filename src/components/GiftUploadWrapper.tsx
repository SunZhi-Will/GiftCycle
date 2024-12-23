'use client';
import dynamic from 'next/dynamic';

const GiftUploadForm = dynamic(() => import('./GiftUploadForm'), {
    loading: () => <p>Loading...</p>,
    ssr: false
});

export default function GiftUploadWrapper() {
    return (
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20">
            <GiftUploadForm />
        </div>
    );
} 