import crypto from 'crypto';

export function verifyInitData(initData: string, botToken: string): { ok: boolean; userId?: string; error?: string } {
  try {
    if (!initData) return { ok: false, error: 'missing initData' };
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return { ok: false, error: 'missing hash' };

    const entries: string[] = [];
    params.forEach((v, k) => {
      if (k !== 'hash') entries.push(`${k}=${v}`);
    });
    entries.sort();
    const dataCheckString = entries.join('\n');

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hmac !== hash) return { ok: false, error: 'bad signature' };

    const userStr = params.get('user');
    if (!userStr) return { ok: false, error: 'no user' };
    const userObj = JSON.parse(userStr);
    const userId = String(userObj.id);
    return { ok: true, userId };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}
