'use client';
import { AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import React from 'react';

interface Gift {
    message?: string;
}

type NotificationStore = {
    isVisible: boolean;
    receivedGift: Gift | null;
    show: (gift: Gift) => void;
    hide: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
    isVisible: false,
    receivedGift: null,
    show: (gift) => set({ isVisible: true, receivedGift: gift }),
    hide: () => set({ isVisible: false, receivedGift: null }),
}));

export function SuccessNotification() {
    const { isVisible, receivedGift, hide } = useNotificationStore();

    React.useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                hide();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, hide]);

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-white rounded-xl shadow-2xl p-6 z-[9999]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">上傳成功！</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    您的禮物已成功上傳，{receivedGift ? '並收到了一份驚喜！' : '等待被人領取。'}
                                </p>
                                {receivedGift && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">收到的祝福：</p>
                                        <p className="text-sm font-medium text-gray-900">{receivedGift.message || '沒有留言'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={hide}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
} 