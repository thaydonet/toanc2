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

interface DauItem {
  desc: string;
  da: 'sole' | 'dongvi' | 'trongcungphia';
}
const DAU_HIEU: DauItem[] = [
  { desc: 'Hai góc so le trong bằng nhau', da: 'sole' },
  { desc: 'Hai góc đồng vị bằng nhau', da: 'dongvi' },
  { desc: 'Hai góc trong cùng phía bù nhau', da: 'trongcungphia' },
];
const DAU_OPTIONS = [
  { key: 'sole', label: 'So le trong bằng nhau' },
  { key: 'dongvi', label: 'Đồng vị bằng nhau' },
  { key: 'trongcungphia', label: 'Trong cùng phía bù nhau' },
];

interface GocPool {
  q: string;
  ans: string;
  wrong: string[];
}
const GOC_POOL: GocPool[] = [
  { q: 'a ∥ b. Góc so le trong = 70°. Góc đồng vị tương ứng?', ans: '70°', wrong: ['110°', '90°', '180°'] },
  { q: 'a ∥ b. Góc so le trong = 55°. Góc trong cùng phía?', ans: '125°', wrong: ['55°', '75°', '180°'] },
  { q: 'a ∥ b. Góc đồng vị = 80°. Góc so le trong?', ans: '80°', wrong: ['100°', '60°', '120°'] },
  { q: 'a ∥ b. Góc trong cùng phía = 110°. Góc còn lại?', ans: '70°', wrong: ['110°', '190°', '80°'] },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HaiDuongThangSongSongInteractive() {
  const [tab, setTab] = useState<'dauhieu' | 'tanggiao'>('dauhieu');

  const [choices, setChoices] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const choose = (i: number, key: string) => { if (checked) return; setChoices(p => ({ ...p, [i]: key })); };
  const correctDau = DAU_HIEU.filter((it, i) => choices[i] === it.da).length;

  const [gQ, setGQ] = useState(() => ({ item: pick(GOC_POOL), order: shuffle([...GOC_POOL[0].wrong, GOC_POOL[0].ans]) }));
  const [gPicked, setGPicked] = useState<string | null>(null);
  const newG = () => { const it = pick(GOC_POOL); setGQ({ item: it, order: shuffle([...it.wrong, it.ans]) }); setGPicked(null); };
  const gAns = gQ.item.ans;

  return (
    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.25rem' }}>∥</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Hai đường thẳng song song</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setTab('dauhieu'); setChecked(false); }} style={tabBtn(tab === 'dauhieu')}>1. Dấu hiệu nhận biết</button>
        <button onClick={() => setTab('tanggiao')} style={tabBtn(tab === 'tanggiao')}>2. Tính góc</button>
      </div>

      {tab === 'dauhieu' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>Dữ kiện sau thuộc dấu hiệu nào để nhận biết a ∥ b?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {DAU_HIEU.map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', padding: '0.55rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff' }}>
                <span style={{ fontWeight: 700, color: '#334155', flex: '1', minWidth: '200px' }}>{it.desc}</span>
                <span style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {DAU_OPTIONS.map(op => {
                    const sel = choices[i] === op.key;
                    return (
                      <button key={op.key} onClick={() => choose(i, op.key)} disabled={checked}
                        style={{ padding: '0.3rem 0.7rem', borderRadius: '6px', border: '2px solid #2563eb', cursor: 'pointer', fontWeight: 700, background: sel ? '#2563eb' : '#fff', color: sel ? '#fff' : '#2563eb', opacity: checked ? 0.6 : 1, fontSize: '0.82rem' }}>
                        {op.label}
                      </button>
                    );
                  })}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
            {!checked ? (
              <button onClick={() => setChecked(true)} disabled={Object.keys(choices).length !== DAU_HIEU.length}
                style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: Object.keys(choices).length === DAU_HIEU.length ? '#10b981' : '#cbd5e1', color: Object.keys(choices).length === DAU_HIEU.length ? '#fff' : '#64748b' }}>
                ✅ Kiểm tra
              </button>
            ) : (
              <button onClick={() => { setChecked(false); setChoices({}); }} style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>🔄 Làm lại</button>
            )}
            {checked && (
              <span style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', background: correctDau === DAU_HIEU.length ? '#dcfce7' : '#fef3c7', color: correctDau === DAU_HIEU.length ? '#166534' : '#92400e' }}>
                Kết quả: {correctDau}/{DAU_HIEU.length} câu đúng
              </span>
            )}
          </div>
        </div>
      )}

      {tab === 'tanggiao' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            <strong style={{ color: '#2563eb' }}>{gQ.item.q}</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {gQ.order.map((opt, i) => {
              const isC = opt === gAns;
              let s: React.CSSProperties = { padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #cbd5e1', background: '#fff', cursor: 'pointer', textAlign: 'center', fontSize: '1.15rem', fontWeight: 700 };
              if (gPicked === opt) { s.borderColor = '#2563eb'; s.background = '#eff6ff'; }
              if (gPicked !== null) {
                if (isC) { s.borderColor = '#22c55e'; s.background = '#f0fdf4'; s.color = '#15803d'; }
                else if (gPicked === opt) { s.borderColor = '#ef4444'; s.background = '#fef2f2'; s.color = '#b91c1c'; }
              }
              return <button key={i} disabled={gPicked !== null} onClick={() => setGPicked(opt)} style={s}>{opt}</button>;
            })}
          </div>
          {gPicked === null ? (
            <button onClick={newG} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>🎲 Câu hỏi mới</button>
          ) : (
            <div>
              <div style={{ padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '0.8rem', background: gPicked === gAns ? '#dcfce7' : '#fee2e2', color: gPicked === gAns ? '#166534' : '#991b1b', border: `1px solid ${gPicked === gAns ? '#86efac' : '#fca5a5'}` }}>
                <strong>{gPicked === gAns ? '🎉 Chính xác!' : '❌ Chưa đúng!'}</strong> Khi a ∥ b: hai góc so le trong bằng nhau, hai góc đồng vị bằng nhau, hai góc trong cùng phía bù nhau (tổng 180°).
              </div>
              <button onClick={newG} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#059669', color: '#fff' }}>🎲 Câu hỏi tiếp theo</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}