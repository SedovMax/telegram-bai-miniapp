import { supabaseAdmin } from '@/lib/supabaseClient';
import { verifyInitData } from '@/lib/telegramVerify';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { score, category, initData } = await req.json();
    if (typeof score !== 'number' || !category) {
      return new Response(JSON.stringify({ ok: false, error: 'Bad input' }), { status: 400 });
    }
    const botToken = process.env.TELEGRAM_BOT_TOKEN!;
    const v = verifyInitData(initData, botToken);
    if (!v.ok || !v.userId) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized: ' + (v.error || '') }), { status: 401 });
    }
    const { error } = await supabaseAdmin()
      .from('bai_results')
      .insert({ score, category, user_id: v.userId });
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok: false, error: String(e.message || e) }), { status: 500 });
  }
}
