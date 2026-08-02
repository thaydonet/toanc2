import { useState } from 'react';

const tabBtn = (active: boolean): React.CSSProperties => ({
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  backgroundColor: active ? '#2563eb' : '#f1f5f9',
  color: active ? '#ffffff' : '#475569',
  transition: 'all 0.2s',
});

interface PhanLoaiItem { label: string; cls: string; why: string; }
const PHAN_LOAI: PhanLoaiItem[] = [
  { label: '35°', cls: 'Nhọn', why: '0° < 35° < 90° nên là góc nhọn.' },
  { label: '180°', cls: 'Bẹt', why: '180° bằng đúng góc bẹt.' },
  { label: '95°', cls: 'Tù', why: '90° < 95° < 180° nên là góc tù.' },
  { label: '90°', cls: 'Vuông', why: '90° bằng góc vuông.' },
  { label: '130°', cls: 'Tù', why: '90° < 130° < 180° nên là góc tù.' },
  { label: '60°', cls: 'Nhọn', why: '0° < 60° < 90° nên là góc nhọn.' },
];
const CLASS_LOAI = ['Nhọn', 'Vuông', 'Tù', 'Bẹt'];

interface CalcItem { q: string; ans: string; wrong: string[]; }
const CALC_POOL: CalcItem[] = [
  { q: 'Góc 120° được chia bởi tia phân giác. Mỗi góc bằng?', ans: '60°', wrong: ['120°', '240°', '90°'] },
  { q: 'Hai góc kề bù: một góc 50°. Góc còn lại?', ans: '130°', wrong: ['50°', '40°', '180°'] },
  { q: 'a ∥ b, góc so le trong = 70°. Góc đồng vị tương ứng?', ans: '70°', wrong: ['110°', '35°', '180°'] },
  { q: 'a ∥ b, góc trong cùng phía = 100°. Góc còn lại?', ans: '80°', wrong: ['180°', '90°', '20°'] },
  { q: 'Hai góc đối đỉnh: một góc 65°. Góc đối đỉnh với nó?', ans: '65°', wrong: ['115°', '25°', '90°'] },
  { q: 'a ∥ b, góc đồng vị = 40°. Góc so le trong?', ans: '40°', wrong: ['140°', '60°', '80°'] },
];

const GOC_BAN = [30, 40, 50, 60, 80, 100, 110, 120];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function OnTapChuong3Lop7Interactive() {
  const [tab, setTab] = useState<'loai' | 'tinh' | 'bu'>('loai');

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const choose = (i: number, c: string) => { if (checked) return; setAnswers(p => ({ ...p, [i]: c })); };
  const correct = PHAN_LOAI.filter((it, i) => answers[i] === it.cls).length;
  const allAnswered = PHAN_LOAI.every((_, i) => i in answers);

  const [q, setQ] = useState(() => ({ item: pick(CALC_POOL), order: shuffle([...CALC_POOL[0].wrong, CALC_POOL[0].ans]) }));
  const [picked, setPicked] = useState<string | null>(null);
  const newQ = () => { const it = pick(CALC_POOL); setQ({ item: it, order: shuffle([...it.wrong, it.ans]) }); setPicked(null); };
  const ans = q.item.ans;

  const [n, setN] = useState(60);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const newBu = () => { setN(pick(GOC_BAN)); setInput(''); setStatus('idle'); };
  const checkBu = () => {
    const v = Number(input);
    if (input.trim() === '' || isNaN(v)) return;
    const correct = 180 - n;
    setStatus(v === correct ? 'ok' : 'wrong');
    if (v === correct) setScore(s => s + 1);
  };

  return (
    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.25rem' }}>📚</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Ôn tập chương 3 — Góc và đường thẳng song song</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setTab('loai'); setChecked(false); }} style={tabBtn(tab === 'loai')}>1. Phân loại góc</button>
        <button onClick={() => setTab('tinh')} style={tabBtn(tab === 'tinh')}>2. Tính góc</button>
        <button onClick={() => setTab('bu')} style={tabBtn(tab === 'bu')}>3. Góc bù</button>
      </div>

      {tab === 'loai' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>Phân loại mỗi góc sau.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {PHAN_LOAI.map((it, i) => {
              const picked = answers[i];
              const showState = checked && picked !== undefined;
              const ok = checked && picked === it.cls;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', padding: '0.55rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', minWidth: '70px' }}>{it.label}</span>
                  <span style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {CLASS_LOAI.map(c => {
                      const sel = picked === c;
                      return <button key={c} onClick={() => choose(i, c)} disabled={checked} style={{ padding: '0.3rem 0.7rem', borderRadius: '6px', border: '2px solid #2563eb', cursor: 'pointer', fontWeight: 700, background: sel ? '#2563eb' : '#fff', color: sel ? '#fff' : '#2563eb', opacity: checked ? 0.6 : 1, fontSize: '0.82rem' }}>{c}</button>;
                    })}
                  </span>
                  {showState && (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: ok ? '#166534' : '#991b1b', background: ok ? '#dcfce7' : '#fee2e2', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>{ok ? '✓ Đúng' : '✗ Sai'}</span>
                  )}
                  {checked && picked !== undefined && !ok && (
                    <span style={{ flexBasis: '100%', fontSize: '0.82rem', color: '#991b1b' }}>{it.why}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
            {!checked ? (
              <button onClick={() => { if (allAnswered) setChecked(true); }} disabled={!allAnswered} style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: allAnswered ? '#10b981' : '#cbd5e1', color: allAnswered ? '#fff' : '#64748b' }}>✅ Kiểm tra</button>
            ) : (
              <button onClick={() => { setChecked(false); setAnswers({}); }} style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>🔄 Làm lại</button>
            )}
            {checked && (
              <span style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', background: correct === PHAN_LOAI.length ? '#dcfce7' : '#fef3c7', color: correct === PHAN_LOAI.length ? '#166534' : '#92400e' }}>Kết quả: {correct}/{PHAN_LOAI.length} câu đúng</span>
            )}
          </div>
        </div>
      )}

      {tab === 'tinh' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}><strong style={{ color: '#2563eb' }}>{q.item.q}</strong></p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {q.order.map((opt, i) => {
              const isC = opt === ans;
              let s: React.CSSProperties = { padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #cbd5e1', background: '#fff', cursor: 'pointer', textAlign: 'center', fontSize: '1.15rem', fontWeight: 700 };
              if (picked === opt) { s.borderColor = '#2563eb'; s.background = '#eff6ff'; }
              if (picked !== null) {
                if (isC) { s.borderColor = '#22c55e'; s.background = '#f0fdf4'; s.color = '#15803d'; }
                else if (picked === opt) { s.borderColor = '#ef4444'; s.background = '#fef2f2'; s.color = '#b91c1c'; }
              }
              return <button key={i} disabled={picked !== null} onClick={() => setPicked(opt)} style={s}>{opt}</button>;
            })}
          </div>
          {picked === null ? (
            <button onClick={newQ} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>🎲 Câu hỏi mới</button>
          ) : (
            <button onClick={newQ} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#059669', color: '#fff' }}>🎲 Câu hỏi tiếp theo</button>
          )}
        </div>
      )}

      {tab === 'bu' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Góc bù của <strong style={{ fontSize: '1.3rem', color: '#2563eb' }}>{n}°</strong> bằng bao nhiêu?
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <input type="number" value={input} onChange={e => { setInput(e.target.value); setStatus('idle'); }} disabled={status === 'ok'} placeholder="Đáp án"
              style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '2px solid #93c5fd', fontSize: '1.1rem', fontWeight: 700, width: '120px', outline: 'none', background: status === 'ok' ? '#dcfce7' : '#fff', borderColor: status === 'ok' ? '#22c55e' : status === 'wrong' ? '#ef4444' : '#93c5fd' }} />
            {status === 'idle' && (
              <button onClick={checkBu} disabled={input.trim() === ''} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: input.trim() === '' ? '#cbd5e1' : '#2563eb', color: '#fff' }}>Kiểm tra</button>
            )}
            <button onClick={newBu} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>🎲 Góc mới</button>
          </div>
          {status === 'ok' && <div style={{ padding: '0.7rem 1rem', borderRadius: '8px', background: '#dcfce7', color: '#166534', border: '1px solid #86efac', fontWeight: 600 }}>✅ Chính xác! Góc bù của {n}° là 180° − {n}° = {180 - n}°.</div>}
          {status === 'wrong' && <div style={{ padding: '0.7rem 1rem', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 600 }}>❌ Chưa đúng. Góc bù = 180° − {n}° = {180 - n}°.</div>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, background: '#e0f2fe', color: '#0369a1' }}>⭐ Điểm: {score}</span>
          </div>
        </div>
      )}
    </div>
  );
}