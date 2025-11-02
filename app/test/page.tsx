'use client';

import { useMemo, useState, useEffect } from 'react';
import { questions } from '@/data/bai';

declare global { interface Window { Telegram?: any; } }

function sum(arr: number[]) { return arr.reduce((a,b)=>a+b,0); }
function interpret(total: number) {
  if (total <= 7) return 'Минимальная';
  if (total <= 15) return 'Лёгкая';
  if (total <= 25) return 'Умеренная';
  return 'Выраженная';
}

export default function TestPage() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [saving, setSaving] = useState(false);
  const [initData, setInitData] = useState<string>('');
  const total = useMemo(()=>sum(answers), [answers]);
  const category = useMemo(()=>interpret(total), [total]);

useEffect(() => {
  try {
    const tg = window.Telegram?.WebApp;
    tg?.expand();
    tg?.ready();

    // 1) прямой доступ
    let data = tg?.initData || '';

    // 2) fallback: взять из location.hash -> tgWebAppData
    if (!data && typeof window !== 'undefined') {
      const h = new URLSearchParams(window.location.hash.slice(1));
      const fromHash = h.get('tgWebAppData');
      if (fromHash) data = decodeURIComponent(fromHash);
    }

    setInitData(data);
  } catch {}
}, []);


  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: total, category, initData })
      });
      const j = await res.json();
      alert(j.ok ? 'Сохранено' : ('Ошибка: ' + j.error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <h2>Тест</h2>
      <ol>
        {questions.map((q, i) => (
          <li key={i} style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 6 }}>{q}</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[0,1,2,3].map(v => (
                <label key={v} style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={v}
                    checked={answers[i] === v}
                    onChange={() => {
                      const next = answers.slice(); next[i] = v; setAnswers(next);
                    }}
                  />
                  <span>{v}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div style={{ marginTop: 12 }}>
        <strong>Сумма: {total}</strong> · <span>{category}</span>
      </div>
      <button disabled={saving} onClick={save} style={{ marginTop: 8 }}>Сохранить результат</button>
      {!initData && <p style={{ marginTop: 8, color: 'crimson' }}>Открой через WebApp-кнопку в боте, чтобы распознать пользователя.</p>}
    </main>
  );
}
