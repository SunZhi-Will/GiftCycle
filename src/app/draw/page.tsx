'use client';
import { useState, useEffect, useCallback } from 'react';
import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/lib/supabase';
import GiftCard from '@/components/GiftCard';
import { motion, AnimatePresence } from 'framer-motion';
import GiftModal from '@/components/GiftModal';
import Image from 'next/image';
import type { Gift } from '@/types/gift';

function SuccessNotification({
    onClose,
    setShowSuccess
}: {
    receivedGift: Gift;
    onClose: () => void;
    setShowSuccess: (show: boolean) => void;
}) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-8 left-1/2 -translate-x-1/2 w-[400px] bg-white rounded-xl shadow-2xl p-6 z-[9999]"
            >
                <div className="flex items-start gap-4">
                    {/* ... 其他內容保持不變 ... */}
                </div>
                <button
                    onClick={() => setShowSuccess(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </motion.div>
        </>
    );
}

export default function DrawPage() {
    const [userGifts, setUserGifts] = useState<number>(0);
    const [remainingDraws, setRemainingDraws] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentGift, setCurrentGift] = useState<Gift | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [drawnGifts, setDrawnGifts] = useState<Gift[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [availableGifts, setAvailableGifts] = useState<number>(0);
    const clientId = useClientId();
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

    const loadUserInfo = useCallback(async () => {
        try {
            // 獲取用戶上傳的禮物數量
            const { data: user } = await supabase
                .from('users')
                .select('upload_count')
                .eq('id', clientId)
                .single();

            // 獲取用戶已抽取的禮物數量
            const { count: receivedCount } = await supabase
                .from('gifts')
                .select('id', { count: 'exact' })
                .eq('received_by', clientId);

            // 獲取可抽取的禮物總數
            const { count: availableCount } = await supabase
                .from('gifts')
                .select('id', { count: 'exact' })
                .is('received_by', null)
                .neq('user_id', clientId);

            // 獲取最近抽到的5個禮物
            const { data: recentGifts } = await supabase
                .from('gifts')
                .select('*')
                .eq('received_by', clientId)
                .order('created_at', { ascending: false })
                .limit(5);

            setUserGifts(user?.upload_count || 0);
            setRemainingDraws((user?.upload_count || 0) - (receivedCount || 0));
            setAvailableGifts(availableCount || 0);
            setDrawnGifts(recentGifts || []);
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }, [clientId]);

    useEffect(() => {
        if (clientId) {
            loadUserInfo();
        }
    }, [clientId, loadUserInfo]);

    const handleDraw = async () => {
        // 檢查條件
        if (remainingDraws <= 0) {
            alert('您的抽取次數已用完，請先上傳禮物');
            return;
        }

        if (availableGifts <= 0) {
            alert('目前沒有可以抽取的禮物，請稍後再試');
            return;
        }

        try {
            setIsDrawing(true);
            setIsLoading(true);
            setIsRevealed(false);

            // 改善抽卡動畫效果
            const cardAnimations = [
                { scale: 1.1, rotate: -5 },
                { scale: 0.9, rotate: 5 },
                { scale: 1.0, rotate: 0 }
            ];

            for (const animation of cardAnimations) {
                setCurrentGift({
                    id: `temp-${Math.random()}`,
                    image_url: '/images/card-back.png',
                    message: '抽取中...',
                    created_at: new Date().toISOString(),
                    received_by: null,
                    user_id: undefined,
                    animation: animation
                } as Gift);
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // 保存上一張卡片到歷史記錄
            if (currentGift?.id && !currentGift.id.startsWith('temp-')) {
                setDrawnGifts(prev => [currentGift, ...prev].slice(0, 5));
            }

            const response = await fetch('/api/gifts/draw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientId }),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    alert('目前沒有可以抽取的禮物');
                } else if (response.status === 403) {
                    alert('您的抽取次數已用完');
                } else {
                    throw new Error('抽取失敗');
                }
                return;
            }

            const { gift, stats } = await response.json();

            setUserGifts(stats.userGifts);
            setRemainingDraws(stats.remainingDraws);
            setAvailableGifts(prev => prev - 1);

            await new Promise(resolve => setTimeout(resolve, 500));
            setCurrentGift(gift);

            setTimeout(() => {
                setIsRevealed(true);
                setIsDrawing(false);
            }, 1000);

        } catch (error) {
            console.error('Error drawing gift:', error);
            alert('抽取失敗，請稍後再試');
        } finally {
            setIsLoading(false);
        }
    };

    if (!clientId) return null;

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-6">
                        抽取聖誕禮物
                    </h1>
                    <div className="flex justify-center items-center gap-6 flex-wrap">
                        <span className="text-lg text-white">
                            已上傳: <span className="font-bold text-red-400">{userGifts}</span> 份
                        </span>
                        <span className="text-lg text-white">
                            剩餘抽取: <span className="font-bold text-green-400">{remainingDraws}</span> 次
                        </span>
                        <span className="text-lg text-white">
                            可抽取的禮物: <span className="font-bold text-yellow-400">{availableGifts}</span> 份
                        </span>
                    </div>
                    {availableGifts === 0 && remainingDraws > 0 && (
                        <p className="text-yellow-400 mt-4">
                            目前沒有可以抽取的禮物，請稍後再試！
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-center gap-8">
                    {/* 禮物卡片區域 */}
                    <div className="h-96 flex items-center justify-center perspective-1000">
                        <AnimatePresence mode="wait">
                            <GiftCard
                                imageUrl={currentGift?.image_url}
                                message={currentGift?.message}
                                isRevealed={isRevealed}
                                onDraw={handleDraw}
                                isLoading={isLoading}
                            />
                        </AnimatePresence>
                    </div>

                    {/* 繼續抽卡按鈕 - 移到這裡 */}
                    <div className="flex items-center justify-center">
                        <button
                            onClick={handleDraw}
                            disabled={isDrawing || remainingDraws <= 0}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 
                                     text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            {isDrawing ? '抽取中...' : '繼續抽卡'}
                        </button>
                    </div>

                    {/* 抽卡歷史記錄 */}
                    {drawnGifts.length > 0 && (
                        <div className="w-full mt-8">
                            <h3 className="text-xl font-bold text-white mb-4">最近抽到的禮物</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {drawnGifts.map((gift, index) => (
                                    <motion.div
                                        key={gift.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/10 backdrop-blur-md rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
                                        onClick={() => setSelectedGift(gift)}
                                    >
                                        <div className="aspect-square relative mb-2">
                                            <Image
                                                src={gift.image_url}
                                                alt="禮物"
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <p className="text-white text-sm truncate">{gift.message}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 成功通知 */}
            <AnimatePresence>
                {showSuccess && (
                    <SuccessNotification
                        receivedGift={currentGift as Gift}
                        onClose={() => setShowSuccess(false)}
                        setShowSuccess={setShowSuccess}
                    />
                )}
            </AnimatePresence>

            {/* 放大顯示的 Modal */}
            <AnimatePresence>
                {selectedGift && (
                    <GiftModal
                        gift={selectedGift}
                        onClose={() => setSelectedGift(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}