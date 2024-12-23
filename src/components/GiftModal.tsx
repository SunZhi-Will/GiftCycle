import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Gift } from '@/types/gift';

interface GiftModalProps {
    gift: Gift;
    onClose: () => void;
}

export default function GiftModal({ gift, onClose }: GiftModalProps) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="max-w-2xl w-[90vw] bg-white rounded-xl shadow-2xl p-6"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="aspect-video relative mb-4">
                        <Image
                            src={gift.image_url}
                            alt="禮物"
                            fill
                            className="object-contain rounded-lg"
                        />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800">聖誕祝福</h3>
                        <p className="text-gray-600">{gift.message}</p>
                        <p className="text-sm text-gray-400">
                            收到時間：{new Date(gift.created_at).toLocaleString('zh-TW')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
} 