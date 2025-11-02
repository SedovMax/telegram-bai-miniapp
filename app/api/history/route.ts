import { supabaseAdmin } from '@/lib/supabaseClient';

export const runtime = 'edge';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('bai_results')
      .select('created_at, score, category')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return new Response(JSON.stringify(data ?? []), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok: false, error: String(e.message || e) }), { status: 500 });
  }
}
