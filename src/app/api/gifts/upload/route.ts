import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';
import { uploadToImgur } from '@/lib/imgur';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const message = formData.get('message') as string;
        const clientId = formData.get('clientId') as string;

        if (!file || !clientId) {
            return new Response('Missing required fields', { status: 400 });
        }

        // 確保用戶存在
        const { data: user } = await supabase
            .from('users')
            .upsert({ id: clientId })
            .select()
            .single();

        // 上傳到 Imgur
        const imgurLink = await uploadToImgur(file);

        // 上傳禮物到資料庫
        const { data: gift, error } = await supabase
            .from('gifts')
            .insert({
                image_url: imgurLink,
                message: message || null,
                user_id: clientId
            })
            .select()
            .single();

        console.log('Upload result:', { gift, error });

        if (error) {
            console.error('Database error:', error);
            return new Response('Upload failed', { status: 500 });
        }

        // 更新用戶上傳次數
        await supabase
            .from('users')
            .update({
                upload_count: user.upload_count + 1,
                last_upload_at: new Date().toISOString()
            })
            .eq('id', clientId);

        // 隨機獲取一個其他禮物
        const { data: receivedGift } = await supabase
            .from('gifts')
            .select()
            .is('received_by', null)
            .neq('user_id', clientId)
            .order('random()')
            .limit(1)
            .single();

        if (receivedGift) {
            await supabase
                .from('gifts')
                .update({
                    received_by: clientId,
                    received_at: new Date().toISOString()
                })
                .eq('id', receivedGift.id);
        }

        return Response.json({ gift, receivedGift });

    } catch (error) {
        console.error('Upload error:', error);
        return new Response('Upload failed', { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}; 