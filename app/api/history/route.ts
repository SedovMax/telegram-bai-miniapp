import { supabaseAdmin } from '@/lib/supabaseClient';
import { verifyInitData } from '@/lib/telegramVerify';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { initData } = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN!;
    const v = verifyInitData(initData, botToken);
    if (!v.ok || !v.userId) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized: ' + (v.error || '') }), { status: 401 });
    }
    const { data, error } = await supabaseAdmin()
      .from('bai_results')
      .select('created_at, score, category')
      .eq('user_id', v.userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return new Response(JSON.stringify(data ?? []), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok: false, error: String(e.message || e) }), { status: 500 });
  }
}
