'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface GiftCardProps {
    imageUrl?: string;
    message?: string;
    isRevealed: boolean;
    onDraw?: () => void;
    isLoading?: boolean;
}

export default function GiftCard({
    imageUrl = '',
    message = '',
    isRevealed,
    onDraw,
    isLoading = false
}: GiftCardProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [shouldReveal, setShouldReveal] = useState(false);

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    useEffect(() => {
        if (isRevealed && !isLoading && isImageLoaded) {
            setTimeout(() => setShouldReveal(true), 500);
        } else {
            setShouldReveal(false);
        }
    }, [isRevealed, isLoading, isImageLoaded]);

    return (
        <>
            {!isRevealed && (
                <motion.div
                    className="relative w-72 h-96 perspective-1000 cursor-pointer"
                    initial={false}
                    transition={{
                        duration: 0.8,
                        type: "tween",
                        ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => !isRevealed && !isLoading && onDraw?.()}
                >
                    <motion.div
                        className={`absolute w-full h-full rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-xl 
                    flex items-center justify-center `}
                    >
                        <div className="text-center">
                            <Image
                                src="/gift-box.svg"
                                width={100}
                                height={100}
                                alt="禮物"
                                className={isLoading ? "animate-pulse" : "animate-bounce"}
                                priority
                            />
                            <p className="text-white mt-4 font-medium">
                                {isLoading ? "抽取中..." : "點擊抽取禮物"}
                            </p>
                        </div>
                    </motion.div>
                </motion.div >
            )}

            {isRevealed && (
                <motion.div
                    className="relative w-72 h-96 perspective-1000 cursor-pointer"
                    initial={false}
                    animate={{ rotateY: shouldReveal ? 0 : 180 }}
                    transition={{
                        duration: 0.8,
                        type: "tween",
                        ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => !isRevealed && !isLoading && onDraw?.()}
                >
                    {/* 卡片正面 */}
                    <motion.div
                        className={`absolute w-full h-full rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-xl 
                    flex items-center justify-center ${shouldReveal ? 'backface-hidden' : ''}`}
                    >
                        <div className="text-center">
                            <Image
                                src="/gift-box.svg"
                                width={100}
                                height={100}
                                alt="禮物"
                                className={isLoading ? "animate-pulse" : "animate-bounce"}
                                priority
                            />
                            <p className="text-white mt-4 font-medium">
                            </p>
                        </div>
                    </motion.div>

                    {/* 卡片背面 */}
                    <motion.div
                        className={`absolute w-full h-full rounded-2xl bg-white shadow-xl overflow-hidden
                    transform rotate-y-180 ${shouldReveal ? '' : 'backface-hidden'}`}
                        style={{
                            transform: shouldReveal ? 'rotateY(180deg) scaleX(-1)' : 'rotateY(180deg)'
                        }}
                    >
                        {imageUrl ? (
                            <div className="relative w-full h-1/2">
                                <Image
                                    src={imageUrl}
                                    fill
                                    alt="禮物圖片"
                                    className="object-cover"
                                    onLoad={handleImageLoad}
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="w-full h-1/2 bg-gray-100 flex items-center justify-center">
                                <p className="text-gray-400">無圖片</p>
                            </div>
                        )}
                        <div className="p-4 space-y-2">
                            <h3 className="text-lg font-bold text-gray-800">聖誕祝福</h3>
                            <p className="text-gray-600 text-sm line-clamp-4">{message || '沒有留言'}</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}

        </>
    );
} 