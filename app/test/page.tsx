'use client';

import { useMemo, useState } from 'react';
import { questions } from '@/data/bai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function sum(arr: number[]) { return arr.reduce((a,b)=>a+b,0); }

function interpret(total: number) {
  // Диапазоны могут отличаться. Проверь по твоему PDF.
  if (total <= 7) return 'Минимальная';
  if (total <= 15) return 'Лёгкая';
  if (total <= 25) return 'Умеренная';
  return 'Выраженная';
}

export default function TestPage() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [saving, setSaving] = useState(false);
  const total = useMemo(()=>sum(answers), [answers]);
  const category = useMemo(()=>interpret(total), [total]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: total, category })
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
    </main>
  );
}
