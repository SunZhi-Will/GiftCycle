'use server';

import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function initializeUserId() {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get("userId")?.value;

    if (!userIdCookie) {
        const newUserId = uuidv4();
        cookieStore.set("userId", newUserId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 365 // 1年
        });
        return newUserId;
    }

    return userIdCookie;
} 