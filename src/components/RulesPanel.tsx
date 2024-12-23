'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function RulesPanel() {
    const [isOpen, setIsOpen] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // 監聽滾動事件
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 添加一個延遲自動關閉的效果（可選）
    useEffect(() => {
        // 5秒後自動關閉規則面板
        const timer = setTimeout(() => {
            setIsOpen(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-[9999]">
            {/* 回到頂部按鈕 */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-3 shadow-lg transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 規則按鈕 */}
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-4 shadow-lg transition-all duration-200"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* 規則面板 */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed bottom-24 right-8 w-80 bg-white rounded-2xl shadow-2xl p-6 z-[9999] max-h-[80vh] overflow-y-auto"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">活動規則</h3>
                            <div className="space-y-3 text-gray-600">
                                <p>1. 上傳一份禮物，可以抽取一份禮物</p>
                                <p>2. 每份禮物只能被抽取一次</p>
                                <p>3. 不能抽到自己上傳的禮物</p>
                                <p>4. 請上傳適合分享的圖片內容</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
} 