export function getInitData(): string {
  try {
    // 1) стандартное место
    // @ts-ignore
    const tg = typeof window !== 'undefined' ? window?.Telegram?.WebApp : undefined;
    let data: string = tg?.initData || '';

    // 2) hash-параметр: #tgWebAppData=...
    if (!data && typeof window !== 'undefined') {
      const h = new URLSearchParams(window.location.hash.slice(1));
      const fromHash = h.get('tgWebAppData');
      if (fromHash) data = decodeURIComponent(fromHash);
    }

    // 3) query-параметр: ?tgWebAppData=...
    if (!data && typeof window !== 'undefined') {
      const s = new URLSearchParams(window.location.search);
      const fromSearch = s.get('tgWebAppData');
      if (fromSearch) data = decodeURIComponent(fromSearch);
    }

    // 4) кэш на случай переходов между страницами
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
