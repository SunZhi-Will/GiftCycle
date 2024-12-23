import { createHmac } from 'crypto';

export function generateUploadToken() {
    const timestamp = Date.now();
    const signature = createHmac('sha256', process.env.SECRET_KEY!)
        .update(timestamp.toString())
        .digest('hex');

    return { timestamp, signature };
}

export function verifyUploadToken(timestamp: number, signature: string) {
    const expectedSignature = createHmac('sha256', process.env.SECRET_KEY!)
        .update(timestamp.toString())
        .digest('hex');

    const isValid = signature === expectedSignature;
    const isRecent = Date.now() - timestamp < 5 * 60 * 1000; // 5分鐘內有效

    return isValid && isRecent;
} 