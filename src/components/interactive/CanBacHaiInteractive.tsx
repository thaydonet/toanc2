import { useState } from 'react';

const SQUARES = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400];

function fmtVN(v: number): string {
  return String(v).replace('.', ',');
}

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

const EXPR = [
  { label: '√2', value: Math.sqrt(2) },
  { label: '1,5', value: 1.5 },
  { label: '√3', value: Math.sqrt(3) },
  { label: '√5', value: Math.sqrt(5) },
  { label: '√7', value: Math.sqrt(7) },
  { label: '√10', value: Math.sqrt(10) },
  { label: '3', value: 3 },
  { label: '2,5', value: 2.5 },
  { label: '1,8', value: 1.8 },
  { label: '√20', value: Math.sqrt(20) },
  { label: '4,5', value: 4.5 },
  { label: '√50', value: Math.sqrt(50) },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Opt {
  text: string;
  correct: boolean;
}

export default function CanBacHaiInteractive() {
  const [tab, setTab] = useState<'tinh' | 'sosanh' | 'timx'>('tinh');

  // ── Tab 1: Tính √n ───────────────────────────────────────────────────────
  const [n, setN] = useState(144);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);

  const newTinh = () => {
    setN(pick(SQUARES));
    setInput('');
    setStatus('idle');
  };
  const checkTinh = () => {
    const v = Number(input);
    if (input.trim() === '' || isNaN(v)) return;
    const correct = Math.sqrt(n);
    setTries(t => t + 1);
    setStatus(v === correct ? 'ok' : 'wrong');
    if (v === correct) setScore(s => s + 1);
  };

  // ── Tab 2: So sánh ───────────────────────────────────────────────────────
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(3);
  const A = EXPR[idxA], B = EXPR[idxB];
  const cmp = A.value > B.value ? '>' : A.value < B.value ? '<' : '=';

  // ── Tab 3: Tìm x ─────────────────────────────────────────────────────────
  const makeX = (): { q: string; opts: Opt[]; explain: string } => {
    if (Math.random() < 0.5) {
      const sq = pick(SQUARES.filter(s => s > 1));
      const root = Math.sqrt(sq);
      const opts: Opt[] = [
        { text: `x = ${root} (vì x > 0)`, correct: true },
        { text: `x = -${root}`, correct: false },
        { text: `x = ${sq}`, correct: false },
        { text: `x = ${root / 2}`, correct: false },
      ];
      return {
        q: `Tìm số dương x, biết x² = ${sq}.`,
        opts: shuffle(opts),
        explain: `Vì x > 0 nên x = √${sq} = ${root}.`,
      };
    }
    const m = pick(Array.from({ length: 15 }, (_, i) => i + 2));
    const opts: Opt[] = [
      { text: `x = ${m * m}`, correct: true },
      { text: `x = ${m}`, correct: false },
      { text: `x = ${2 * m}`, correct: false },
      { text: `x = ${m + 2}`, correct: false },
    ];
    return {
      q: `Tìm x, biết √x = ${m}.`,
      opts: shuffle(opts),
      explain: `√x = ${m} nên x = ${m}² = ${m * m}.`,
    };
  };
  const [xq, setXq] = useState(() => makeX());
  const [picked, setPicked] = useState<number | null>(null);
  const [xDone, setXDone] = useState(false);
  const newX = () => {
    setXq(makeX());
    setPicked(null);
    setXDone(false);
  };

  return (
    <div style={{
      background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px',
      padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem',
        borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '1.25rem' }}>√</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Căn bậc hai số học
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('tinh')} style={tabBtn(tab === 'tinh')}>
          1. Tính √n
        </button>
        <button onClick={() => setTab('sosanh')} style={tabBtn(tab === 'sosanh')}>
          2. So sánh căn bậc hai
        </button>
        <button onClick={() => setTab('timx')} style={tabBtn(tab === 'timx')}>
          3. Tìm x
        </button>
      </div>

      {/* ───────── Tab 1: Tính √n ───────── */}
      {tab === 'tinh' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Nhập giá trị của <strong style={{ fontSize: '1.3rem', color: '#2563eb' }}>√{n}</strong>:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <input
              type="number"
              value={input}
              onChange={e => { setInput(e.target.value); setStatus('idle'); }}
              onKeyDown={e => e.key === 'Enter' && status === 'idle' && checkTinh()}
              placeholder="Nhập đáp án"
              disabled={status === 'ok'}
              style={{
                padding: '0.55rem 1rem', borderRadius: '8px', border: '2px solid #93c5fd',
                fontSize: '1.1rem', fontWeight: 700, width: '140px', outline: 'none',
                background: status === 'ok' ? '#dcfce7' : '#ffffff',
                borderColor: status === 'ok' ? '#22c55e' : status === 'wrong' ? '#ef4444' : '#93c5fd',
              }}
            />
            {status === 'idle' && (
              <button onClick={checkTinh} disabled={input.trim() === ''}
                style={{
                  padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700,
                  background: input.trim() === '' ? '#cbd5e1' : '#2563eb', color: '#ffffff',
                }}>
                Kiểm tra
              </button>
            )}
            <button onClick={newTinh}
              style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
              🎲 Câu hỏi mới
            </button>
          </div>

          {status === 'ok' && (
            <div style={{ padding: '0.7rem 1rem', borderRadius: '8px', background: '#dcfce7', color: '#166534', border: '1px solid #86efac', fontWeight: 600 }}>
              ✅ Chính xác! √{n} = {Math.sqrt(n)} vì {Math.sqrt(n)}² = {n}.
            </div>
          )}
          {status === 'wrong' && (
            <div style={{ padding: '0.7rem 1rem', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 600 }}>
              ❌ Chưa đúng. Hãy nhớ: √{n} là số không âm có bình phương bằng {n}. Đáp án là {Math.sqrt(n)}.
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, background: '#e0f2fe', color: '#0369a1' }}>
              ⭐ Điểm: {score}
            </span>
            <span style={{ padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
              Đã trả lời: {tries} câu
            </span>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.88rem', background: '#fefce8', color: '#854d0e', border: '1px solid #fde047' }}>
            💡 <strong>Gợi ý:</strong> 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, 8²=64, 9²=81, 10²=100, 11²=121, 12²=144, 13²=169, 14²=196, 15²=225.
          </div>
        </div>
      )}

      {/* ───────── Tab 2: So sánh ───────── */}
      {tab === 'sosanh' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Chọn hai số để so sánh. Phương pháp: với a, b ≥ 0, ta so sánh a² và b²:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {[
              { label: 'Số thứ nhất', idx: idxA, setIdx: setIdxA, color: '#2563eb' },
              { label: 'Số thứ hai', idx: idxB, setIdx: setIdxB, color: '#059669' },
            ].map((f, k) => (
              <div key={k} style={{ padding: '0.9rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: f.color }}>{f.label}</div>
                <select value={f.idx} onChange={e => f.setIdx(Number(e.target.value))}
                  style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, width: '100%' }}>
                  {EXPR.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
                </select>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                  ≈ {fmtVN(parseFloat(A.value.toFixed(3)))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '0.8rem 1rem', borderRadius: '8px', background: '#ffffff', border: '1px solid #cbd5e1', marginBottom: '0.8rem', fontSize: '0.95rem' }}>
            <strong>So sánh bình phương:</strong> {A.label}² = {fmtVN(parseFloat((A.value * A.value).toFixed(3)))}{' '}
            và {B.label}² = {fmtVN(parseFloat((B.value * B.value).toFixed(3)))}.
          </div>

          <div style={{
            padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.95rem',
            background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe',
          }}>
            <strong>Kết luận:</strong>{' '}
            <strong style={{ fontSize: '1.05rem' }}>{A.label} {cmp} {B.label}</strong>
            {cmp === '=' ? ' (hai số bằng nhau).' : ' — vì cả hai đều không âm và bình phương tương ứng là ' +
              fmtVN(parseFloat((A.value * A.value).toFixed(3))) + ' ' + cmp + ' ' + fmtVN(parseFloat((B.value * B.value).toFixed(3))) + '.'}
          </div>
        </div>
      )}

      {/* ───────── Tab 3: Tìm x ───────── */}
      {tab === 'timx' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            {xq.q}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {xq.opts.map((opt, i) => {
              let style: React.CSSProperties = {
                padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #cbd5e1',
                background: '#ffffff', cursor: 'pointer', textAlign: 'center', fontSize: '1rem',
                fontWeight: 700, transition: 'all 0.2s',
              };
              if (picked === i) {
                style.borderColor = '#2563eb';
                style.background = '#eff6ff';
              }
              if (xDone) {
                if (opt.correct) {
                  style.borderColor = '#22c55e';
                  style.background = '#f0fdf4';
                  style.color = '#15803d';
                } else if (picked === i) {
                  style.borderColor = '#ef4444';
                  style.background = '#fef2f2';
                  style.color = '#b91c1c';
                }
              }
              return (
                <button key={i} disabled={xDone} onClick={() => setPicked(i)} style={style}>
                  {opt.text}
                </button>
              );
            })}
          </div>

          {!xDone ? (
            <button onClick={() => { if (picked !== null) setXDone(true); }}
              disabled={picked === null}
              style={{
                width: '100%', padding: '0.75rem', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: picked !== null ? 'pointer' : 'not-allowed',
                background: picked !== null ? '#2563eb' : '#cbd5e1', color: '#ffffff',
              }}>
              Xác nhận đáp án
            </button>
          ) : (
            <div>
              <div style={{
                padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '0.8rem',
                background: xq.opts[picked!].correct ? '#dcfce7' : '#fee2e2',
                color: xq.opts[picked!].correct ? '#166534' : '#991b1b', border: `1px solid ${xq.opts[picked!].correct ? '#86efac' : '#fca5a5'}`,
              }}>
                <strong>{xq.opts[picked!].correct ? '🎉 Chính xác!' : '❌ Chưa đúng!'}</strong> {xq.explain}
              </div>
              <button onClick={newX}
                style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', background: '#059669', color: '#ffffff' }}>
                🎲 Câu hỏi tiếp theo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
