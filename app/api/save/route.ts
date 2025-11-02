import { supabaseAdmin } from '@/lib/supabaseClient';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { score, category } = await req.json();
    if (typeof score !== 'number' || !category) {
      return new Response(JSON.stringify({ ok: false, error: 'Bad input' }), { status: 400 });
    }
    const created_at = new Date().toISOString();
    // TODO: связать с user_id из Telegram initData при необходимости
    const { error } = await supabaseAdmin()
      .from('bai_results')
      .insert({ score, category, created_at });
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok: false, error: String(e.message || e) }), { status: 500 });
  }
}
