'use client';

import Link from 'next/link';
import { useEffect } from 'react';

declare global {
  interface Window {
    Telegram?: any;
  }
}

export default function Page() {
  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      tg?.expand();
      tg?.enableClosingConfirmation();
      tg?.ready();
    } catch {}
  }, []);

  return (
    <main>
      <h1>Шкала тревоги Бека</h1>
      <p>Нажми, чтобы пройти тест из 21 вопроса. Каждый пункт оцени от 0 до 3 за последнюю неделю.</p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/test">Начать тест</Link>
        <Link href="/chart">Моя динамика</Link>
      </div>
    </main>
  );
}
