import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { clientId } = await request.json();

        if (!clientId) {
            return new Response('Missing client ID', { status: 400 });
        }

        // 檢查用戶的抽取資格
        const { data: user } = await supabase
            .from('users')
            .select('upload_count')
            .eq('id', clientId)
            .single();

        const { count: receivedCount } = await supabase
            .from('gifts')
            .select('id', { count: 'exact' })
            .eq('received_by', clientId);

        const remainingDraws = (user?.upload_count || 0) - (receivedCount || 0);

        if (remainingDraws <= 0) {
            return new Response('No remaining draws', { status: 403 });
        }

        // 隨機獲取一個未被領取的禮物
        console.log('Searching for gift, clientId:', clientId);

        // 先獲取所有可用的禮物
        const { data: gifts } = await supabase
            .from('gifts')
            .select('*')
            .is('received_by', null)
            .neq('user_id', clientId);

        console.log('Available gifts:', gifts?.length);

        // 從中隨機選擇一個
        const gift = gifts && gifts.length > 0
            ? gifts[Math.floor(Math.random() * gifts.length)]
            : null;

        console.log('Selected gift:', gift);

        if (!gift) {
            // 檢查是否真的沒有禮物
            const { count } = await supabase
                .from('gifts')
                .select('*', { count: 'exact' })
                .is('received_by', null);

            console.log('Total available gifts:', count);

            return new Response('No available gifts', { status: 404 });
        }

        // 標記禮物為已領取
        const { error: updateError } = await supabase
            .from('gifts')
            .update({
                received_by: clientId,
                received_at: new Date().toISOString()
            })
            .eq('id', gift.id);

        if (updateError) {
            return new Response('Failed to claim gift', { status: 500 });
        }

        // 返回抽到的禮物和更新後的統計
        return Response.json({
            gift,
            stats: {
                userGifts: user?.upload_count || 0,
                remainingDraws: remainingDraws - 1
            }
        });

    } catch (error) {
        console.error('Draw error:', error);
        return new Response('Internal server error', { status: 500 });
    }
} 