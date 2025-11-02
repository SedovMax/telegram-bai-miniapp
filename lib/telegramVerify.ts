import 'server-only';
import { createHmac } from 'node:crypto';

// WebApp: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
export function verifyInitData(
  initData: string,
  botToken: string
): { ok: boolean; userId?: string; error?: string } {
  try {
    if (!initData) return { ok: false, error: 'missing initData' };

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return { ok: false, error: 'missing hash' };

    const entries: string[] = [];
    params.forEach((v, k) => { if (k !== 'hash') entries.push(`${k}=${v}`); });
    entries.sort();
    const dataCheckString = entries.join('\n');

    // ВАЖНО: secret = HMAC_SHA256(botToken, key='WebAppData')
    const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();

    // Считаем подпись
    const calc = createHmac('sha256', secret).update(dataCheckString).digest('hex');

    if (calc !== hash) return { ok: false, error: 'bad signature' };

    const userStr = params.get('user');
    if (!userStr) return { ok: false, error: 'no user' };
    const user = JSON.parse(userStr);
    return { ok: true, userId: String(user.id) };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}
