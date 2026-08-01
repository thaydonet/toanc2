import { useState } from 'react';

interface QuizItem {
  label: string;
  rational: boolean;
  why: string;
}

const ITEMS: QuizItem[] = [
  { label: '3/4', rational: true, why: '3/4 là một phân số nên viết được dưới dạng a/b (a = 3, b = 4).' },
  { label: '-7', rational: true, why: '-7 = -7/1 nên là số hữu tỉ.' },
  { label: '0', rational: true, why: '0 = 0/1 nên là số hữu tỉ.' },
  { label: '1,25', rational: true, why: '1,25 = 125/100 = 5/4 nên là số hữu tỉ.' },
  { label: '-2/5', rational: true, why: '-2/5 là một phân số nên là số hữu tỉ.' },
  { label: '√2', rational: false, why: '√2 ≈ 1,4142135... (số thập phân vô hạn không tuần hoàn) nên KHÔNG phải số hữu tỉ.' },
  { label: 'π', rational: false, why: 'π ≈ 3,14159... (số thập phân vô hạn không tuần hoàn) nên KHÔNG phải số hữu tỉ.' },
  { label: '0,6', rational: true, why: '0,6 = 6/10 = 3/5 nên là số hữu tỉ.' },
];

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b);
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

export default function SoHuuTiInteractive() {
  const [tab, setTab] = useState<'check' | 'line' | 'compare'>('check');

  // ── Tab 1: Nhận biết số hữu tỉ ──────────────────────────────────────────
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState(false);

  const choose = (idx: number, isRational: boolean) => {
    if (checked) return;
    setAnswers(prev => ({ ...prev, [idx]: isRational }));
  };

  const correctCount = ITEMS.filter((it, i) => answers[i] === it.rational).length;
  const allAnswered = ITEMS.every((_, i) => i in answers);

  // ── Tab 2: Biểu diễn trên trục số ───────────────────────────────────────
  const [num, setNum] = useState(3);
  const [den, setDen] = useState(4);
  const value = num / den;
  const g = gcd(num, den);
  const sNum = num / g, sDen = den / g;
  const start = Math.floor(value) - 1;
  const end = start + 4;
  const W = 680, H = 190, padL = 52, padR = 52, plotW = W - padL - padR, y = 100;
  const x = (v: number) => padL + ((v - start) / (end - start)) * plotW;
  const ints: number[] = [];
  for (let k = start; k <= end; k++) ints.push(k);
  const subticks: number[] = [];
  for (let i = start; i < end; i++) {
    for (let j = 1; j < den; j++) subticks.push(i + j / den);
  }

  // ── Tab 3: So sánh hai số hữu tỉ ────────────────────────────────────────
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(2);
  const [a2, setA2] = useState(2);
  const [b2, setB2] = useState(3);
  const v1 = a1 / b1, v2 = a2 / b2;
  const cmp = v1 > v2 ? '>' : v1 < v2 ? '<' : '=';
  const common = lcm(b1, b2);
  const n1 = a1 * (common / b1), n2 = a2 * (common / b2);
  const scale = 190 / Math.max(1, Math.abs(v1), Math.abs(v2));
  const barLen = (v: number) => Math.min(Math.abs(v) * scale, 210);

  const numOptions = Array.from({ length: 17 }, (_, i) => i - 8);
  const denOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div style={{
      background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px',
      padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem',
        borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '1.25rem' }}>⚡</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Tập hợp các số hữu tỉ
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setTab('check'); setChecked(false); }} style={tabBtn(tab === 'check')}>
          1. Nhận biết số hữu tỉ
        </button>
        <button onClick={() => setTab('line')} style={tabBtn(tab === 'line')}>
          2. Trục số tương tác
        </button>
        <button onClick={() => setTab('compare')} style={tabBtn(tab === 'compare')}>
          3. So sánh hai số hữu tỉ
        </button>
      </div>

      {/* ───────── Tab 1: Nhận biết ───────── */}
      {tab === 'check' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Cho các số sau. Hãy nhận xét mỗi số có phải là số hữu tỉ không bằng cách bấm
            <strong style={{ color: '#2563eb' }}> ∈ ℚ</strong> hoặc <strong style={{ color: '#dc2626' }}> ∉ ℚ</strong>.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {ITEMS.map((it, i) => {
              const ans = answers[i];
              const showState = checked && ans !== undefined;
              const ok = checked && ans === it.rational;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
                  padding: '0.55rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff',
                }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a', minWidth: '70px' }}>
                    {it.label}
                  </span>
                  <span style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => choose(i, true)}
                      style={{
                        padding: '0.3rem 0.9rem', borderRadius: '6px', border: '2px solid #3b82f6', cursor: 'pointer',
                        fontWeight: 700, background: ans === true ? '#2563eb' : '#ffffff',
                        color: ans === true ? '#ffffff' : '#2563eb', opacity: checked ? 0.6 : 1,
                      }}>
                      ∈ ℚ
                    </button>
                    <button onClick={() => choose(i, false)}
                      style={{
                        padding: '0.3rem 0.9rem', borderRadius: '6px', border: '2px solid #ef4444', cursor: 'pointer',
                        fontWeight: 700, background: ans === false ? '#dc2626' : '#ffffff',
                        color: ans === false ? '#ffffff' : '#dc2626', opacity: checked ? 0.6 : 1,
                      }}>
                      ∉ ℚ
                    </button>
                  </span>
                  {showState && (
                    <span style={{
                      fontSize: '0.8rem', fontWeight: 700, color: ok ? '#166534' : '#991b1b',
                      background: ok ? '#dcfce7' : '#fee2e2', padding: '0.2rem 0.6rem', borderRadius: '999px',
                    }}>
                      {ok ? '✓ Đúng' : '✗ Sai'}
                    </span>
                  )}
                  {checked && ans !== undefined && !ok && (
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
                style={{
                  padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700,
                  background: allAnswered ? '#10b981' : '#cbd5e1', color: allAnswered ? '#ffffff' : '#64748b',
                }}>
                ✅ Kiểm tra
              </button>
            ) : (
              <button onClick={() => { setChecked(false); setAnswers({}); }}
                style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
                🔄 Làm lại
              </button>
            )}
            {checked && (
              <span style={{
                padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem',
                background: correctCount === ITEMS.length ? '#dcfce7' : '#fef3c7', color: correctCount === ITEMS.length ? '#166534' : '#92400e',
              }}>
                Kết quả: {correctCount}/{ITEMS.length} câu đúng
              </span>
            )}
            {!allAnswered && !checked && (
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Hãy trả lời đủ {ITEMS.length} số rồi bấm Kiểm tra.</span>
            )}
          </div>
        </div>
      )}

      {/* ───────── Tab 2: Trục số ───────── */}
      {tab === 'line' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Kéo thanh trượt để chọn tử số và mẫu số, quan sát điểm biểu diễn của phân số trên trục số.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                Tử số: <strong style={{ color: '#2563eb' }}>{num}</strong>
              </label>
              <input type="range" min={-8} max={8} value={num} onChange={e => setNum(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                Mẫu số: <strong>{den}</strong>
              </label>
              <input type="range" min={1} max={8} value={den} onChange={e => setDen(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#1f2937" strokeWidth="2" />
            <polygon points={`${W - padR},${y} ${W - padR - 9},${y - 5} ${W - padR - 9},${y + 5}`} fill="#1f2937" />
            {subticks.map((st, i) => (
              <line key={`s${i}`} x1={x(st)} y1={y - 6} x2={x(st)} y2={y + 6} stroke="#94a3b8" strokeWidth="1" />
            ))}
            {ints.map(k => (
              <g key={`i${k}`}>
                <line x1={x(k)} y1={y - 10} x2={x(k)} y2={y + 10} stroke="#1f2937" strokeWidth="2" />
                <text x={x(k)} y={y + 28} fontSize="15" textAnchor="middle" fill={k === 0 ? '#10b981' : '#1f2937'} fontWeight={k === 0 ? 800 : 500}>{k}</text>
              </g>
            ))}
            <line x1={x(0)} y1={y - 14} x2={x(0)} y2={y + 14} stroke="#10b981" strokeWidth="2.5" />
            <circle cx={x(value)} cy={y} r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
            <text x={x(value)} y={y - 24} fontSize="16" fontWeight="800" textAnchor="middle" fill="#ef4444">
              {sNum}/{sDen}
            </text>
            <text x={x(value)} y={y + 55} fontSize="13" textAnchor="middle" fill="#475569">
              = {value % 1 === 0 ? value.toFixed(0) : value.toFixed(3)}
            </text>
          </svg>

          <div style={{
            marginTop: '0.9rem', padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.9rem',
            background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe',
          }}>
            <strong>Nhận xét:</strong> {num}/{den} = {sNum}/{sDen} (phân số tối giản).
            {Number.isInteger(value) ? (
              <> Trên trục số, điểm biểu diễn <strong>{num}/{den}</strong> trùng với số nguyên <strong>{value}</strong>.</>
            ) : (
              <> Trên trục số, điểm biểu diễn <strong>{num}/{den}</strong> nằm giữa hai số nguyên <strong>{Math.floor(value)}</strong> và <strong>{Math.ceil(value)}</strong>.</>
            )}
          </div>
        </div>
      )}

      {/* ───────── Tab 3: So sánh ───────── */}
      {tab === 'compare' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Chọn tử số và mẫu số của hai phân số, công cụ sẽ so sánh chúng bằng cách quy đồng mẫu dương.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {[
              { label: 'Phân số thứ nhất', a: a1, b: b1, setA: setA1, setB: setB1, color: '#2563eb' },
              { label: 'Phân số thứ hai', a: a2, b: b2, setA: setA2, setB: setB2, color: '#059669' },
            ].map((f, idx) => (
              <div key={idx} style={{ padding: '0.9rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: f.color }}>{f.label}</div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tử:</span>
                    <select value={f.a} onChange={e => f.setA(Number(e.target.value))}
                      style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                      {numOptions.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Mẫu:</span>
                    <select value={f.b} onChange={e => f.setB(Number(e.target.value))}
                      style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                      {denOptions.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '0.6rem', fontSize: '1.15rem', fontWeight: 800, color: f.color }}>
                  {f.a}/{f.b} = {(f.a / f.b).toFixed(3)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', height: '150px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '0.8rem 1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[v1, v2].map((v, i) => {
                const len = barLen(v);
                const color = i === 0 ? '#2563eb' : '#059669';
                const isNeg = v < 0;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ width: '52px', fontSize: '0.82rem', fontWeight: 700, color }}>
                      {i === 0 ? `${a1}/${b1}` : `${a2}/${b2}`}
                    </span>
                    <div style={{ flex: 1, position: 'relative', height: '24px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#94a3b8',
                      }} />
                      <div style={{
                        position: 'absolute', top: 0, bottom: 0, background: color, borderRadius: '6px',
                        left: isNeg ? `${50 - len}%` : '50%', width: `${len}%`, opacity: 0.85,
                      }} />
                    </div>
                    <span style={{ width: '70px', textAlign: 'right', fontSize: '0.82rem', color: '#475569' }}>
                      {v > 0 ? '+' : ''}{v.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' }}>← số âm &nbsp;|&nbsp; 0 &nbsp;|&nbsp; số dương →</div>
          </div>

          <div style={{
            marginTop: '0.9rem', padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.92rem',
            background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe',
          }}>
            <strong>Quy đồng mẫu:</strong> MSC = {common}. Ta có {a1}/{b1} = {n1}/{common} và {a2}/{b2} = {n2}/{common}.
            <br />
            Vì {n1} {cmp === '=' ? '=' : cmp === '>' ? '>' : '<'} {n2} nên kết luận:{' '}
            <strong style={{ fontSize: '1.05rem' }}>{a1}/{b1} {cmp} {a2}/{b2}</strong>
            {cmp === '=' && ' (hai số hữu tỉ bằng nhau)'}.
          </div>
        </div>
      )}
    </div>
  );
}
