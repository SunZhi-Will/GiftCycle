'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import ChristmasTree from '@/components/ChristmasTree';

interface GiftPosition {
    id: string;
    image_url: string;
    x: number;
    y: number;
    scale: number;
    rotate: number;
    message: string;
    created_at: string;
}

const calculatePosition = (index: number, total: number) => {
    // 將計算函數移到組件外部
    const treeWidth = 600;
    const treeTop = 50;
    const treeBottom = 550;

    const heightPercent = index / total;
    const y = treeTop + heightPercent * (treeBottom - treeTop);
    const maxWidth = 400 * (1 - heightPercent);
    const centerX = treeWidth / 2;
    const x = centerX + (Math.random() - 0.5) * maxWidth;

    return {
        x,
        y,
        scale: 0.3 + Math.random() * 0.2,
        rotate: Math.random() * 30 - 15
    };
};

// 禮物裝飾組件
const GiftDecoration = ({ gift, onClick }: { gift: GiftPosition, onClick: () => void }) => {
    return (
        <motion.div
            key={gift.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1,
                scale: gift.scale,
                x: gift.x,
                y: gift.y,
                rotate: gift.rotate
            }}
            transition={{ duration: 0.5 }}
            whileHover={{
                scale: gift.scale * 1.3,
                zIndex: 10,
                transition: { duration: 0.2 }
            }}
            className="absolute w-12 h-12 cursor-pointer origin-center"
            style={{
                left: -24,
                top: -24,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
            onClick={onClick}
        >
            <Image
                src={gift.image_url}
                alt="禮物"
                fill
                className="rounded-full object-cover"
                sizes="48px"
                priority={false}
            />
        </motion.div>
    );
};

export default function TreePage() {
    const [gifts, setGifts] = useState<GiftPosition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGift, setSelectedGift] = useState<GiftPosition | null>(null);

    const loadGifts = async () => {
        try {
            const { data } = await supabase
                .from('gifts')
                .select(`
                    id,
                    image_url,
                    message,
                    created_at
                `)
                .not('received_by', 'is', null)
                .order('created_at', { ascending: true });

            if (data) {
                const positionedGifts = data.map((gift, index) => ({
                    ...gift,
                    ...calculatePosition(index, data.length)
                }));
                setGifts(positionedGifts);
            }
        } catch (error) {
            console.error('Error loading gifts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadGifts();

        const subscription = supabase
            .channel('gifts')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'gifts',
                filter: 'received_by=not.is.null'
            }, loadGifts)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // 使用 useMemo 緩存禮物裝飾的渲染
    const giftDecorations = useMemo(() => (
        gifts.map((gift) => (
            <GiftDecoration
                key={gift.id}
                gift={gift}
                onClick={() => setSelectedGift(gift)}
            />
        ))
    ), [gifts, setSelectedGift]);

    if (isLoading) {
        return <div className="text-center text-white mt-24">載入中...</div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-white text-center mb-12">
                    聖誕願望樹
                </h1>

                <div className="relative w-[600px] h-[800px] mx-auto">
                    <div className="absolute inset-0">
                        <ChristmasTree />
                    </div>

                    {giftDecorations}
                </div>

                <p className="text-center text-white mt-8">
                    已收集 {gifts.length} 個願望
                </p>
            </div>

            <AnimatePresence>
                {selectedGift && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={() => setSelectedGift(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-xl p-6 max-w-2xl w-[90%] relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedGift(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="aspect-video relative mb-4">
                                <Image
                                    src={selectedGift.image_url}
                                    alt="禮物"
                                    fill
                                    className="rounded-lg object-contain"
                                    priority
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-800">聖誕祝福</h3>
                                <p className="text-gray-600">{selectedGift.message}</p>
                                <p className="text-sm text-gray-400">
                                    收到時間：{new Date(selectedGift.created_at).toLocaleString('zh-TW')}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 