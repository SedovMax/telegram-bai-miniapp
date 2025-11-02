'use client';

import { useEffect, useState } from 'react';

type Item = { created_at: string; score: number; category: string };

declare global { interface Window { Telegram?: any; } }

export default function ChartPage() {
  const [data, setData] = useState<Item[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(()=>{
    const tg = window.Telegram?.WebApp;
    const initData = tg?.initData || '';
    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData })
    })
      .then(r=>r.json())
      .then(d=>{
        if (Array.isArray(d)) setData(d);
        else setError(d?.error || 'Ошибка');
      })
      .catch(e=>setError(String(e)));
  },[]);

  return (
    <main>
      <h2>Динамика</h2>
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      {data.length === 0 ? <p>Пока нет данных.</p> : <SvgChart items={data} />}
    </main>
  );
}

function SvgChart({ items }: { items: Item[] }) {
  const w = 640, h = 240, pad = 24;
  const xs = items.map((_,i)=>i);
  const ys = items.map(d=>d.score);
  const xMax = Math.max(...xs, 1);
  const yMax = Math.max(...ys, 1);
  const points = items.map((d,i)=>{
    const x = pad + (i / xMax) * (w - 2*pad);
    const y = h - pad - (d.score / yMax) * (h - 2*pad);
    return `${x},${y}`;
  }).join(' ');

  const xLabels = items.map((d,i)=>{
    const x = pad + (i / xMax) * (w - 2*pad);
    return <text key={i} x={x} y={h-6} fontSize="10" textAnchor="middle">{new Date(d.created_at).toLocaleDateString()}</text>;
  });

  return (
    <svg width={w} height={h} role="img" aria-label="График баллов">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
      <line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} stroke="currentColor" strokeWidth="1" />
      <line x1={pad} y1={pad} x2={pad} y2={h-pad} stroke="currentColor" strokeWidth="1" />
      {xLabels}
    </svg>
  );
}
