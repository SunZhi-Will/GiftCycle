'use client';
import { useState, useEffect, useCallback } from 'react';
import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import GiftModal from '@/components/GiftModal';
import Image from 'next/image';

interface Gift {
    id: string;
    image_url: string;
    message: string;
    created_at: string;
    user_id: string;
    received_by: string | null;
}

export default function GiftsPage() {
    const [receivedGifts, setReceivedGifts] = useState<Gift[]>([]);
    const [sentGifts, setSentGifts] = useState<Gift[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
    const clientId = useClientId();

    const loadGifts = useCallback(async () => {
        try {
            setIsLoading(true);

            // 獲取收到的禮物
            const { data: received } = await supabase
                .from('gifts')
                .select(`
                    id,
                    image_url,
                    message,
                    created_at,
                    user_id,
                    received_by
                `)
                .eq('received_by', clientId)
                .order('created_at', { ascending: false });

            // 獲取送出的禮物
            const { data: sent } = await supabase
                .from('gifts')
                .select(`
                    id,
                    image_url, 
                    message,
                    created_at,
                    user_id,
                    received_by
                `)
                .eq('user_id', clientId)
                .order('created_at', { ascending: false });

            setReceivedGifts(received || []);
            setSentGifts(sent || []);
        } catch (error) {
            console.error('Error loading gifts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [clientId]);

    useEffect(() => {
        if (clientId) {
            loadGifts();
        }
    }, [clientId, loadGifts]);

    const GiftCard = ({ gift, type }: { gift: Gift, type: 'received' | 'sent' }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => setSelectedGift(gift)}
        >
            <div className="aspect-square relative mb-2">
                <Image
                    src={gift.image_url}
                    alt="禮物"
                    className="object-cover rounded-lg"
                    fill
                />
            </div>
            <div className="space-y-2">
                <p className="text-white text-sm truncate">{gift.message}</p>
                <p className="text-xs text-gray-400">
                    {type === 'received' ? '來自：' : '送給：'}
                    <span className="text-gray-300">
                        {type === 'received'
                            ? '匿名'
                            : gift.received_by || '尚未被領取'}
                    </span>
                </p>
                <p className="text-xs text-gray-400">
                    {new Date(gift.created_at).toLocaleString('zh-TW')}
                </p>
            </div>
        </motion.div>
    );

    if (!clientId) return null;

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-8">
                        我的禮物
                    </h1>

                    {/* 分頁標籤 */}
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('received')}
                            className={`px-6 py-2 rounded-lg transition-colors ${activeTab === 'received'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                        >
                            收到的禮物 ({receivedGifts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`px-6 py-2 rounded-lg transition-colors ${activeTab === 'sent'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                        >
                            送出的禮物 ({sentGifts.length})
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center text-white">載入中...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {activeTab === 'received'
                            ? receivedGifts.map(gift => (
                                <GiftCard key={gift.id} gift={gift} type="received" />
                            ))
                            : sentGifts.map(gift => (
                                <GiftCard key={gift.id} gift={gift} type="sent" />
                            ))
                        }
                    </div>
                )}

                {/* 禮物詳情 Modal */}
                <AnimatePresence>
                    {selectedGift && (
                        <GiftModal
                            gift={selectedGift}
                            onClose={() => setSelectedGift(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}