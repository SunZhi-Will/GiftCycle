'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useClientId } from '@/hooks/useClientId';
import { useNotificationStore } from './SuccessNotification';

const GiftUploadForm = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [answer, setAnswer] = useState('');
    const [challenge] = useState(() => {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        return { num1, num2, result: num1 + num2 };
    });
    const clientId = useClientId();
    const { show: showNotification } = useNotificationStore();

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('請上傳圖片檔案');
            return;
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !clientId) return;

        try {
            setIsUploading(true);

            if (parseInt(answer) !== challenge.result) {
                alert('驗證答案錯誤');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('message', message.trim());
            formData.append('clientId', clientId);

            const response = await fetch('/api/gifts/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('上傳失敗');

            const { receivedGift } = await response.json();

            // 重置表單
            setSelectedFile(null);
            setPreview(null);
            setMessage('');
            setAnswer('');

            // 示成功通知
            showNotification(receivedGift);

        } catch (error) {
            console.error('上傳錯誤:', error);
            alert('上傳失敗，請稍後再試');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div
                    className={`
                        relative border-2 border-dashed rounded-xl p-8 transition-all
                        ${isDragging ? 'border-blue-400 bg-blue-50' : ''}
                        ${preview ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-red-400'}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFile(file);
                        }}
                    />

                    {preview ? (
                        <div className="relative aspect-video">
                            <Image
                                src={preview}
                                alt="預覽圖"
                                fill
                                className="object-contain rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="text-center space-y-4 cursor-pointer">
                            <div className="flex justify-center">
                                <Image
                                    src="/upload-icon.svg"
                                    width={48}
                                    height={48}
                                    alt="上傳"
                                    className="text-gray-400"
                                />
                            </div>
                            <div className="text-gray-500">
                                <p className="font-medium">點擊或拖曳圖片至此處上傳</p>
                                <p className="text-sm">支援 JPG、PNG 格式</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        寫下你的祝福
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="在這裡寫下你想說的話..."
                        maxLength={200}
                        className="w-full h-24 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-900"
                    />
                    <div className="text-right text-sm text-gray-500">
                        {message.length}/200
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        請回答: {challenge.num1} + {challenge.num2} = ?
                    </label>
                    <input
                        type="number"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl text-gray-900"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!selectedFile || isUploading}
                    className={`
                        w-full py-3 px-4 rounded-xl font-medium text-white
                        transition-all duration-200 transform hover:scale-105
                        ${selectedFile
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    `}
                >
                    {isUploading ? '上傳中...' : '開始交換禮物'}
                </button>
            </div>
        </>
    );
};

export default GiftUploadForm;