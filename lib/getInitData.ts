export function getInitData(): string {
  try {
    // 1) стандартное место
    // @ts-ignore
    const tg = typeof window !== 'undefined' ? window?.Telegram?.WebApp : undefined;
    let data: string = tg?.initData || '';

    // 2) query ?tgWebAppData=...  — БЕЗ decode
    if (!data && typeof window !== 'undefined') {
      const s = new URLSearchParams(window.location.search);
      const q = s.get('tgWebAppData');
      if (q) data = q; // не трогаем
    }

    // 3) hash #tgWebAppData=...  — БЕЗ decode
    if (!data && typeof window !== 'undefined') {
      const h = new URLSearchParams(window.location.hash.slice(1));
      const q = h.get('tgWebAppData');
      if (q) data = q; // не трогаем
    }

    // 4) кэш
    if (!data && typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('tgInitData') || '';
      if (cached) data = cached;
    } else if (data && typeof window !== 'undefined') {
      sessionStorage.setItem('tgInitData', data);
    }

    return data || '';
  } catch {
    return '';
  }
}

