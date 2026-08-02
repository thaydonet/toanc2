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

interface ClassifyItem {
  label: string;
  cls: string;
  why: string;
}
const CLASSIFY: ClassifyItem[] = [
  { label: '35°', cls: 'Góc nhọn', why: '0° < 35° < 90° nên là góc nhọn.' },
  { label: '90°', cls: 'Góc vuông', why: '90° đúng bằng góc vuông.' },
  { label: '120°', cls: 'Góc tù', why: '90° < 120° < 180° nên là góc tù.' },
  { label: '180°', cls: 'Góc bẹt', why: '180° bằng góc bẹt.' },
  { label: '80°', cls: 'Góc nhọn', why: '0° < 80° < 90° nên là góc nhọn.' },
  { label: '145°', cls: 'Góc tù', why: '90° < 145° < 180° nên là góc tù.' },
];
const CLASSES = ['Góc nhọn', 'Góc vuông', 'Góc tù', 'Góc bẹt'];

const PHAN_GIAC_POOL = [
  { q: 'xOy = 60°', ans: '30°', wrong: ['60°', '120°', '90°'] },
  { q: 'xOy = 120°', ans: '60°', wrong: ['30°', '120°', '45°'] },
  { q: 'xOy = 90°', ans: '45°', wrong: ['90°', '30°', '60°'] },
  { q: 'xOy = 140°', ans: '70°', wrong: ['140°', '35°', '80°'] },
  { q: 'xOy = 80°', ans: '40°', wrong: ['80°', '20°', '60°'] },
];

const KE_BU_POOL = [
  { q: 'Hai góc kề bù, một góc 40°. Góc còn lại?', ans: '140°', wrong: ['40°', '180°', '90°'] },
  { q: 'Hai góc kề bù, một góc 115°. Góc còn lại?', ans: '65°', wrong: ['115°', '75°', '180°'] },
  { q: 'Hai góc kề bù, một góc 25°. Góc còn lại?', ans: '155°', wrong: ['25°', '75°', '90°'] },
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

export default function GocViTriDacBietInteractive() {
  const [tab, setTab] = useState<'phanLoai' | 'phanGiac' | 'keBu'>('phanLoai');

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const choose = (idx: number, cls: string) => {
    if (checked) return;
    setAnswers(prev => ({ ...prev, [idx]: cls }));
  };
  const correctCount = CLASSIFY.filter((it, i) => answers[i] === it.cls).length;
  const allAnswered = CLASSIFY.every((_, i) => i in answers);

  const [pgQ, setPgQ] = useState(() => ({ item: pick(PHAN_GIAC_POOL), order: shuffle([...PHAN_GIAC_POOL[0].wrong, PHAN_GIAC_POOL[0].ans]) }));
  const [pgPicked, setPgPicked] = useState<string | null>(null);
  const newPg = () => {
    const item = pick(PHAN_GIAC_POOL);
    setPgQ({ item, order: shuffle([...item.wrong, item.ans]) });
    setPgPicked(null);
  };
  const pgCorrect = pgQ.item.ans;

  const [kbQ, setKbQ] = useState(() => ({ item: pick(KE_BU_POOL), order: shuffle([...KE_BU_POOL[0].wrong, KE_BU_POOL[0].ans]) }));
  const [kbPicked, setKbPicked] = useState<string | null>(null);
  const newKb = () => {
    const item = pick(KE_BU_POOL);
    setKbQ({ item, order: shuffle([...item.wrong, item.ans]) });
    setKbPicked(null);
  };
  const kbCorrect = kbQ.item.ans;

  return (
    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.25rem' }}>📐</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Góc ở vị trí đặc biệt và tia phân giác</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setTab('phanLoai'); setChecked(false); }} style={tabBtn(tab === 'phanLoai')}>1. Phân loại góc</button>
        <button onClick={() => setTab('phanGiac')} style={tabBtn(tab === 'phanGiac')}>2. Tia phân giác</button>
        <button onClick={() => setTab('keBu')} style={tabBtn(tab === 'keBu')}>3. Góc kề bù</button>
      </div>

      {tab === 'phanLoai' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>Mỗi góc sau thuộc loại nào?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {CLASSIFY.map((it, i) => {
              const picked = answers[i];
              const showState = checked && picked !== undefined;
              const ok = checked && picked === it.cls;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', padding: '0.55rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', minWidth: '70px' }}>{it.label}</span>
                  <span style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {CLASSES.map(c => (
                      <button key={c} onClick={() => choose(i, c)}
                        style={{
                          padding: '0.3rem 0.7rem', borderRadius: '6px', border: '2px solid #2563eb', cursor: 'pointer',
                          fontWeight: 700, background: picked === c ? '#2563eb' : '#ffffff',
                          color: picked === c ? '#ffffff' : '#2563eb', opacity: checked ? 0.6 : 1, fontSize: '0.85rem',
                        }}>
                        {c}
                      </button>
                    ))}
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
              <button onClick={() => { if (allAnswered) setChecked(true); }}
                disabled={!allAnswered}
                style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: allAnswered ? '#10b981' : '#cbd5e1', color: allAnswered ? '#ffffff' : '#64748b' }}>
                ✅ Kiểm tra
              </button>
            ) : (
              <button onClick={() => { setChecked(false); setAnswers({}); }}
                style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
                🔄 Làm lại
              </button>
            )}
            {checked && (
              <span style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', background: correctCount === CLASSIFY.length ? '#dcfce7' : '#fef3c7', color: correctCount === CLASSIFY.length ? '#166534' : '#92400e' }}>
                Kết quả: {correctCount}/{CLASSIFY.length} câu đúng
              </span>
            )}
          </div>
        </div>
      )}

      {tab === 'phanGiac' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Cho <strong style={{ fontSize: '1.2rem', color: '#2563eb' }}>{pgQ.item.q}</strong>. Tia phân giác tạo mỗi góc bằng?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {pgQ.order.map((opt, i) => {
              const isC = opt === pgCorrect;
              let s: React.CSSProperties = { padding: '0.7rem 1rem', borderRadius: '8px', border: '2px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 };
              if (pgPicked === opt) { s.borderColor = '#2563eb'; s.background = '#eff6ff'; }
              if (pgPicked !== null) {
                if (isC) { s.borderColor = '#22c55e'; s.background = '#f0fdf4'; s.color = '#15803d'; }
                else if (pgPicked === opt) { s.borderColor = '#ef4444'; s.background = '#fef2f2'; s.color = '#b91c1c'; }
              }
              return <button key={i} disabled={pgPicked !== null} onClick={() => setPgPicked(opt)} style={s}>{opt}</button>;
            })}
          </div>
          {pgPicked === null ? (
            <button onClick={newPg} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>🎲 Câu hỏi mới</button>
          ) : (
            <div>
              <div style={{ padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '0.8rem', background: pgPicked === pgCorrect ? '#dcfce7' : '#fee2e2', color: pgPicked === pgCorrect ? '#166534' : '#991b1b', border: `1px solid ${pgPicked === pgCorrect ? '#86efac' : '#fca5a5'}` }}>
                <strong>{pgPicked === pgCorrect ? '🎉 Chính xác!' : '❌ Chưa đúng!'}</strong> Tia phân giác chia góc làm đôi: {pgQ.item.q} → mỗi góc có số đo {pgCorrect}.
              </div>
              <button onClick={newPg} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#059669', color: '#ffffff' }}>🎲 Câu hỏi tiếp theo</button>
            </div>
          )}
        </div>
      )}

      {tab === 'keBu' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            <strong style={{ color: '#2563eb' }}>{kbQ.item.q}</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {kbQ.order.map((opt, i) => {
              const isC = opt === kbCorrect;
              let s: React.CSSProperties = { padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 };
              if (kbPicked === opt) { s.borderColor = '#2563eb'; s.background = '#eff6ff'; }
              if (kbPicked !== null) {
                if (isC) { s.borderColor = '#22c55e'; s.background = '#f0fdf4'; s.color = '#15803d'; }
                else if (kbPicked === opt) { s.borderColor = '#ef4444'; s.background = '#fef2f2'; s.color = '#b91c1c'; }
              }
              return <button key={i} disabled={kbPicked !== null} onClick={() => setKbPicked(opt)} style={s}>{opt}</button>;
            })}
          </div>
          {kbPicked === null ? (
            <button onClick={newKb} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>🎲 Câu hỏi mới</button>
          ) : (
            <div>
              <div style={{ padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '0.8rem', background: kbPicked === kbCorrect ? '#dcfce7' : '#fee2e2', color: kbPicked === kbCorrect ? '#166534' : '#991b1b', border: `1px solid ${kbPicked === kbCorrect ? '#86efac' : '#fca5a5'}` }}>
                <strong>{kbPicked === kbCorrect ? '🎉 Chính xác!' : '❌ Chưa đúng!'}</strong> Hai góc kề bù luôn có tổng 180°.
              </div>
              <button onClick={newKb} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#059669', color: '#ffffff' }}>🎲 Câu hỏi tiếp theo</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}