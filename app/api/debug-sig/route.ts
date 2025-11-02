import { verifyInitData } from '@/lib/telegramVerify';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { initData } = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN!;
    const params = new URLSearchParams(initData || '');
    const hash = params.get('hash') || '';
    const entries: string[] = [];
    params.forEach((v, k) => { if (k !== 'hash') entries.push(`${k}=${v}`); });
    entries.sort();
    const dataCheckString = entries.join('\n');

    const v = verifyInitData(initData || '', botToken);
    return new Response(JSON.stringify({
      ok: v.ok,
      error: v.error || null,
      hasHash: !!hash,
      sampleDataCheckStringStart: dataCheckString.slice(0, 120),
      userFieldPresent: !!params.get('user')
    }), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok:false, error:String(e.message||e) }), { status: 500 });
  }
}
