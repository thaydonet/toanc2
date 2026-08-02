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

interface DinhLiItem {
  stmt: string;
  gt: string;
  kl: string;
}

const DLI_STAND: DinhLiItem[] = [
  { stmt: 'Hai góc đối đỉnh thì bằng nhau', gt: 'Hai góc đối đỉnh', kl: 'Hai góc đối đỉnh thì bằng nhau' },
  { stmt: 'Hai góc so le trong bằng nhau thì hai đường thẳng song song', gt: 'Hai góc so le trong bằng nhau', kl: 'hai dưỡng thẳng song song' },
  { stmt: 'Số hữu tỉ cộng số hữu tỉ', gt: 'Số nguyên bằng nhau', kl: 'Tổng hai số hữu tỉ' },
];

const KET_LUAN_POOL = [
  { q: 'GT về góc đồng vị. Rút ra kết luận:', options: ['Bằng nhau', 'Bù nhau', 'Không quan hệ'], ans: 'Bằng nhau' },
  { q: 'GT: a ∥ b và b ∥ c. Suy ra:', options: ['a ∥ c', 'a ⟂ c', 'a trùng b'], ans: 'a ∥ c' },
  { q: 'GT: a ⟂ c, b ⟂ c. Rút ra:', options: ['a ∥ b', 'a ⟂ b', 'a trùng b'], ans: 'a ∥ b' },
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function DinhLyChungMinhInteractive() {
  const [tab, setTab] = useState<'phanbiet' | 'ketluan'>('phanbiet');

  const [dh, setDh] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const pickDh = (i: number, v: string) => { if (checked) return; setDh(p => ({ ...p, [i]: v })); };
  const allDh = DLI_STAND.every((_, i) => i in dh);

  const [q, setQ] = useState(() => ({ item: pick(KET_LUAN_POOL), order: shuffle(KET_LUAN_POOL[0].options) }));
  const [picked, setPicked] = useState<string | null>(null);
  const newQ = () => { const it = pick(KET_LUAN_POOL); setQ({ item: it, order: shuffle(it.options) }); setPicked(null); };

  return (
    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.25rem' }}>🧾</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Định lí và chứng minh định lí</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setTab('phanbiet'); setChecked(false); }} style={tabBtn(tab === 'phanbiet')}>1. Giả thiết – kết luận</button>
        <button onClick={() => setTab('ketluan')} style={tabBtn(tab === 'ketluan')}>2. Rút ra kết luận</button>
      </div>

      {tab === 'phanbiet' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>Mỗi định lí sau đã cho GT và KL. Hãy chọn đáp án đúng cho phần kết luận (KL).</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {DLI_STAND.map((it, i) => {
              const opts = [it.kl, it.gt];
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.55rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>Định lí: {it.stmt}</span>
                  <span style={{ fontWeight: 600, color: '#b45309' }}>GT: {it.gt}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>KL:</span>
                    {opts.map(o => {
                      const sel = dh[i] === o;
                      return (
                        <button key={o} onClick={() => pickDh(i, o)} disabled={checked}
                          style={{ padding: '0.3rem 0.7rem', borderRadius: '6px', border: '2px solid #2563eb', cursor: 'pointer', fontWeight: 700, background: sel ? '#2563eb' : '#fff', color: sel ? '#fff' : '#2563eb', opacity: checked ? 0.6 : 1, fontSize: '0.82rem' }}>
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
            {!checked ? (
              <button onClick={() => setChecked(true)} disabled={!allDh} style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: allDh ? '#10b981' : '#cbd5e1', color: allDh ? '#fff' : '#64748b' }}>✅ Kiểm tra</button>
            ) : (
              <button onClick={() => { setChecked(false); setDh({}); }} style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>🔄 Làm lại</button>
            )}
            {checked && (
              <span style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', background: '#fef3c7', color: '#92400e' }}>
                Hãy nhìn phần KL đậm để đối chiếu nhé!
              </span>
            )}
          </div>
        </div>
      )}

      {tab === 'ketluan' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            <strong style={{ color: '#2563eb' }}>{q.item.q}</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {q.order.map((opt, i) => {
              const isC = opt === q.item.ans;
              let s: React.CSSProperties = { padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #cbd5e1', background: '#fff', cursor: 'pointer', textAlign: 'center', fontSize: '1.05rem', fontWeight: 700 };
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
    </div>
  );
}