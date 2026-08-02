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

interface GocPool {
  q: string;
  ans: string;
  wrong: string[];
}
const GOC_POOL: GocPool[] = [
  { q: 'a ∥ b. Góc so le trong = 60°. Góc đồng vị tương ứng?', ans: '60°', wrong: ['120°', '90°', '180°'] },
  { q: 'a ∥ b. Góc so le trong = 45°. Góc trong cùng phía?', ans: '135°', wrong: ['45°', '75°', '180°'] },
  { q: 'a ∥ b. Góc đồng vị = 75°. Góc so le trong?', ans: '75°', wrong: ['105°', '15°', '90°'] },
  { q: 'a ∥ b. Góc trong cùng phía = 115°. Góc kia?', ans: '65°', wrong: ['115°', '185°', '85°'] },
  { q: 'a ∥ b. Góc đồng vị = 30°. Góc trong cùng phía với nó?', ans: '150°', wrong: ['30°', '60°', '90°'] },
];

const DUNG_SAI = [
  { stmt: 'Qua một điểm ngoài đường thẳng chỉ có một đường thẳng song song với nó', ok: true, why: 'Đúng — đây chính là tiên đề Euclid.' },
  { stmt: 'Nếu a ∥ b thì hai góc so le trong bằng nhau.', ok: true, why: 'Đúng — tính chất của hai đường thẳng song song.' },
  { stmt: 'Nếu a ∥ b thì hai góc trong cùng phía bằng nhau.', ok: false, why: 'Sai — hai góc trong cùng phía bù nhau (tổng 180°), không bằng nhau.' },
  { stmt: 'Qua một điểm ngoài đường thẳng có vô số đường thẳng song song.', ok: false, why: 'Sai — theo tiên đề Euclid chỉ có duy nhất một đường thẳng.' },
  { stmt: 'Hai đường thẳng phân biệt cùng song song với đường thẳng thứ ba thì song song.', ok: true, why: 'Đúng — tính bắc cầu của quan hệ song song.' },
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function TienDeEuclidInteractive() {
  const [tab, setTab] = useState<'dungsai' | 'tinhgoc'>('dungsai');

  const [choice, setChoice] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState(false);
  const pickB = (i: number, v: boolean) => { if (checked) return; setChoice(p => ({ ...p, [i]: v })); };
  const correctDS = DUNG_SAI.filter((it, i) => choice[i] === it.ok).length;

  const [gQ, setGQ] = useState(() => ({ item: pick(GOC_POOL), order: shuffle([...GOC_POOL[0].wrong, GOC_POOL[0].ans]) }));
  const [gPicked, setGPicked] = useState<string | null>(null);
  const newG = () => { const it = pick(GOC_POOL); setGQ({ item: it, order: shuffle([...it.wrong, it.ans]) }); setGPicked(null); };
  const gAns = gQ.item.ans;

  return (
    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.25rem' }}>🎯</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Tiên đề Euclid và tính chất</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setTab('dungsai'); setChecked(false); }} style={tabBtn(tab === 'dungsai')}>1. Đúng hay sai</button>
        <button onClick={() => setTab('tinhgoc')} style={tabBtn(tab === 'tinhgoc')}>2. Tính góc</button>
      </div>

      {tab === 'dungsai' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>Khẳng định sau đây đúng hay sai?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {DUNG_SAI.map((it, i) => {
              const picked = choice[i];
              const showState = checked && picked !== undefined;
              const ok = checked && picked === it.ok;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', padding: '0.55rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff' }}>
                  <span style={{ fontWeight: 700, color: '#334155', flex: '1', minWidth: '220px' }}>{it.stmt}</span>
                  <span style={{ display: 'flex', gap: '0.4rem' }}>
                    {[{ f: true, l: 'Đúng' }, { f: false, l: 'Sai' }].map(o => {
                      const sel = picked === o.f;
                      return <button key={String(o.f)} onClick={() => pickB(i, o.f)} disabled={checked}
                        style={{ padding: '0.3rem 0.9rem', borderRadius: '6px', border: '2px solid #2563eb', cursor: 'pointer', fontWeight: 700, background: sel ? '#2563eb' : '#fff', color: sel ? '#fff' : '#2563eb', opacity: checked ? 0.6 : 1 }}>
                        {o.l}
                      </button>;
                    })}
                  </span>
                  {showState && (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: ok ? '#166534' : '#991b1b', background: ok ? '#dcfce7' : '#fee2e2', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      {ok ? '✓ Đúng' : '✗ Sai'}
                    </span>
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
              <button onClick={() => setChecked(true)} disabled={Object.keys(choice).length !== DUNG_SAI.length}
                style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: Object.keys(choice).length === DUNG_SAI.length ? '#10b981' : '#cbd5e1', color: Object.keys(choice).length === DUNG_SAI.length ? '#fff' : '#64748b' }}>
                ✅ Kiểm tra
              </button>
            ) : (
              <button onClick={() => { setChecked(false); setChoice({}); }} style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>🔄 Làm lại</button>
            )}
            {checked && (
              <span style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', background: correctDS === DUNG_SAI.length ? '#dcfce7' : '#fef3c7', color: correctDS === DUNG_SAI.length ? '#166534' : '#92400e' }}>
                Kết quả: {correctDS}/{DUNG_SAI.length} câu đúng
              </span>
            )}
          </div>
        </div>
      )}

      {tab === 'tinhgoc' && (
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
                <strong>{gPicked === gAns ? '🎉 Chính xác!' : '❌ Chưa đúng!'}</strong> Khi a ∥ b: góc so le trong bằng nhau, góc đồng vị bằng nhau, góc trong cùng phía bù nhau (tổng 180°).
              </div>
              <button onClick={newG} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#059669', color: '#fff' }}>🎲 Câu hỏi tiếp theo</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}