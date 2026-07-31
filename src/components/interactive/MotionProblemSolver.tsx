import { useState } from 'react';

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function frac(n: number, d: number = 1): string {
  if (d === 0) return '∞';
  if (n === 0) return '0';
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d);
  return (d / g === 1) ? String(n / g) : `${n / g}/${d / g}`;
}

function intCf(c: number, v: string, first: boolean): string {
  if (c === 0) return first ? '0' : '';
  const neg = c < 0, a = Math.abs(c);
  const pre = first ? (neg ? '−' : '') : (neg ? ' − ' : ' + ');
  return pre + (a === 1 ? '' : a) + v;
}

function eqStr(a: number, b: number, c: number): string {
  let s = '';
  if (a !== 0) s += intCf(a, 'x', true);
  if (b !== 0) s += intCf(b, 'y', s === '');
  return (s || '0') + ` = ${c}`;
}

interface Step { label: string; lines: string[]; isResult?: boolean; }

/* ── SVG diagram for opposite-direction problem ──────────── */
function MotionDiagram({ S, t, xPct }: { S: number; t: number; xPct: number }) {
  const w = 400, h = 140;
  const xA = 70, xB = 330, yRoad = 90;
  const xMeet = xA + xPct * (xB - xA);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', margin: '0 auto', background: '#fafafa', borderRadius: 12, border: '1px solid #e5e7eb' }}>
      {/* Road */}
      <line x1={xA} y1={yRoad} x2={xB} y2={yRoad} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <line x1={xA} y1={yRoad - 16} x2={xA} y2={yRoad + 16} stroke="#64748b" strokeWidth="3" />
      <line x1={xB} y1={yRoad - 16} x2={xB} y2={yRoad + 16} stroke="#64748b" strokeWidth="3" />

      {/* A label */}
      <text x={xA} y={yRoad + 40} textAnchor="middle" fontWeight="bold" fill="#64748b" fontSize="15">A</text>
      <circle cx={xA} cy={yRoad} r="4" fill="#64748b" />

      {/* B label */}
      <text x={xB} y={yRoad + 40} textAnchor="middle" fontWeight="bold" fill="#64748b" fontSize="15">B</text>
      <circle cx={xB} cy={yRoad} r="4" fill="#64748b" />

      {/* Distance label */}
      <text x={(xA + xB) / 2} y={yRoad - 30} textAnchor="middle" fontWeight="bold" fill="#6b21a8" fontSize="14">
        S = {S} km
      </text>

      {/* Meeting point */}
      <text x={xMeet} y={yRoad - 30} textAnchor="middle" fill="#ca8a04" fontWeight="bold" fontSize="12">
        Gặp sau {t}h
      </text>
      <circle cx={xMeet} cy={yRoad} r="6" fill="#ca8a04" stroke="white" strokeWidth="2" />
      <text x={xMeet} y={yRoad + 4} textAnchor="middle" fill="white" fontWeight="bold" fontSize="9">★</text>

      {/* Car A (left → right) */}
      <rect x={xA + 10} y={yRoad - 12} width="36" height="18" rx="4" fill="#ef4444" />
      <polygon points={`${xA + 46},${yRoad} ${xA + 38},${yRoad - 7} ${xA + 38},${yRoad + 7}`} fill="#ef4444" />
      <text x={xA + 28} y={yRoad + 5} textAnchor="middle" fill="white" fontWeight="bold" fontSize="10">A</text>

      {/* Car B (right → left) */}
      <rect x={xB - 46} y={yRoad - 12} width="36" height="18" rx="4" fill="#3b82f6" />
      <polygon points={`${xB - 46},${yRoad} ${xB - 38},${yRoad - 7} ${xB - 38},${yRoad + 7}`} fill="#3b82f6" />
      <text x={xB - 28} y={yRoad + 5} textAnchor="middle" fill="white" fontWeight="bold" fontSize="10">B</text>

      {/* Speed labels below */}
      <text x={xA + 28} y={yRoad + 58} textAnchor="middle" fill="#ef4444" fontWeight="bold" fontSize="11">v₁ →</text>
      <text x={xB - 28} y={yRoad + 58} textAnchor="middle" fill="#3b82f6" fontWeight="bold" fontSize="11">← v₂</text>
    </svg>
  );
}

/* ── Solving steps ───────────────────────────────────────── */
function buildSolveSteps(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): Step[] {
  const D = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  if (D === 0) {
    const msg = (Dx === 0 && Dy === 0)
      ? ['Hệ có VÔ SỐ NGHIỆM']
      : ['Hệ VÔ NGHIỆM'];
    return [{ label: 'Kết luận', isResult: true, lines: msg }];
  }

  const steps: Step[] = [];
  const gx = gcd(Math.abs(a1), Math.abs(a2));
  const k1 = Math.abs(a2) / gx;
  const k2 = Math.abs(a1) / gx;

  if (k1 !== 1 || k2 !== 1) {
    const lines: string[] = [];
    if (k1 !== 1) lines.push(`Nhân (1) với ${k1}: ${eqStr(k1 * a1, k1 * b1, k1 * c1)}   (1')`);
    if (k2 !== 1) lines.push(`Nhân (2) với ${k2}: ${eqStr(k2 * a2, k2 * b2, k2 * c2)}   (2')`);
    steps.push({ label: 'Nhân để cùng hệ số |x|', lines });
  }

  const na1 = k1 * a1, nb1 = k1 * b1, nc1 = k1 * c1;
  const na2 = k2 * a2, nb2 = k2 * b2, nc2 = k2 * c2;
  const sameSign = (na1 > 0 && na2 > 0) || (na1 < 0 && na2 < 0);

  let yCoef: number, yRHS: number, opStr: string;
  if (sameSign) {
    const o1 = { yC: nb2 - nb1, yR: nc2 - nc1, op: "(2') − (1')" };
    const o2 = { yC: nb1 - nb2, yR: nc1 - nc2, op: "(1') − (2')" };
    const ch = o1.yC >= 0 ? o1 : o2;
    yCoef = ch.yC; yRHS = ch.yR; opStr = ch.op;
  } else {
    yCoef = nb1 + nb2; yRHS = nc1 + nc2; opStr = "(1') + (2')";
  }

  steps.push({
    label: `${sameSign ? 'Trừ' : 'Cộng'} vế để khử ẩn x`,
    lines: [`Thực hiện ${opStr}:`, `→  ${intCf(yCoef, 'y', true)} = ${yRHS}`],
  });

  if (yCoef === 0) return steps;

  const yFrac = frac(yRHS, yCoef);
  steps.push({ label: 'Tìm y', lines: [`y = ${yFrac}`] });

  const rhsNum = c1 * D - b1 * Dy;
  const xFrac = frac(Dx, D);
  steps.push({
    label: 'Thế y để tìm x',
    lines: [
      `Thay y = ${yFrac} vào (1): ${eqStr(a1, b1, c1)}`,
      `→  ${intCf(a1, 'x', true)} = ${frac(rhsNum, D)}`,
      `→  x = ${xFrac}`,
    ],
  });

  steps.push({
    label: '✅ Nghiệm của hệ', isResult: true,
    lines: [`x = ${xFrac}   ;   y = ${yFrac}`],
  });

  return steps;
}

/* ── Component ───────────────────────────────────────────── */
export default function MotionProblemSolver() {
  const [S, setS] = useState(200);
  const [t, setT] = useState(2);
  const [diffType, setDiffType] = useState<'difference' | 'ratio'>('difference');
  const [diffVal, setDiffVal] = useState(10);
  const [ratioVal, setRatioVal] = useState(1.5);

  const [steps, setSteps] = useState<Step[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [solved, setSolved] = useState(false);
  const [xPct, setXPct] = useState(0.55);

  const handleSolve = () => {
    const s: Step[] = [];

    s.push({
      label: 'Bước 1 — Chọn ẩn và đặt điều kiện',
      lines: [
        'Gọi vận tốc xe thứ nhất là x (km/h), x > 0',
        'Gọi vận tốc xe thứ hai là y (km/h), y > 0',
      ],
    });

    s.push({
      label: 'Bước 2 — Lập phương trình (1)',
      lines: [
        `Hai xe đi ngược chiều, gặp nhau sau ${t} giờ:`,
        `Quãng đường xe 1 đi: x·${t} = ${t}x (km)`,
        `Quãng đường xe 2 đi: y·${t} = ${t}y (km)`,
        `Tổng quãng đường bằng AB = ${S} km:`,
        `→  ${t}x + ${t}y = ${S}`,
        `→  x + y = ${frac(S, t)}`,
      ],
    });

    if (diffType === 'difference') {
      s.push({
        label: 'Bước 3 — Lập phương trình (2)',
        lines: [
          `Vận tốc xe 1 lớn hơn xe 2 là ${diffVal} km/h:`,
          `→  x − y = ${diffVal}`,
          ``,
          `Hệ phương trình:`,
          `⎧ x + y = ${frac(S, t)}`,
          `⎩ x − y = ${diffVal}`,
        ],
      });
    } else {
      s.push({
        label: 'Bước 3 — Lập phương trình (2)',
        lines: [
          `Vận tốc xe 1 gấp ${ratioVal} lần xe 2:`,
          `→  x = ${ratioVal}·y`,
          ``,
          `Hệ phương trình:`,
          `⎧ x + y = ${frac(S, t)}`,
          `⎩ x = ${ratioVal}·y`,
        ],
      });
    }

    // Compute system to solve
    const sum = S / t;
    let a1: number, b1: number, c1: number;
    let a2: number, b2: number, c2: number;

    if (diffType === 'difference') {
      a1 = 1; b1 = 1; c1 = sum;
      a2 = 1; b2 = -1; c2 = diffVal;
    } else {
      a1 = 1; b1 = 1; c1 = sum;
      a2 = 1; b2 = -ratioVal; c2 = 0;
    }

    // Compute position for diagram
    const D = a1 * b2 - a2 * b1;
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;
    if (D !== 0) {
      const xVal = Dx / D;
      const dist1 = xVal * t;
      setXPct(Math.max(0.05, Math.min(0.95, dist1 / S)));
    }

    s.push({
      label: 'Bước 4 — Giải hệ phương trình',
      lines: ['Áp dụng phương pháp cộng đại số:'],
    });

    const solveSteps = buildSolveSteps(a1, b1, c1, a2, b2, c2);
    s.push(...solveSteps);

    const xVal = Dx / D;
    const yVal = Dy / D;
    const fmt = (n: number) => Number.isInteger(n) ? String(n) : n.toFixed(2);

    s.push({
      label: '✅ Kết luận bài toán', isResult: true,
      lines: [
        `Vận tốc xe thứ nhất: x = ${fmt(xVal)} km/h`,
        `Vận tốc xe thứ hai: y = ${fmt(yVal)} km/h`,
        ``,
        `Kiểm tra:`,
        `  Quãng đường xe 1: ${fmt(xVal)} × ${t} = ${fmt(xVal * t)} km`,
        `  Quãng đường xe 2: ${fmt(yVal)} × ${t} = ${fmt(yVal * t)} km`,
        `  Tổng: ${fmt(xVal * t)} + ${fmt(yVal * t)} = ${fmt(xVal * t + yVal * t)} km ${Math.abs(xVal * t + yVal * t - S) < 0.01 ? '✓' : '✗'}`,
      ],
    });

    setSteps(s);
    setSolved(true);
    setRevealed(1);
  };

  const handleReset = () => {
    setSolved(false);
    setSteps([]);
    setRevealed(0);
  };

  const iSt: React.CSSProperties = {
    width: 64, padding: '6px 4px', textAlign: 'center',
    border: '2px solid #fca5a5', borderRadius: 8,
    fontWeight: 700, fontSize: '1rem', color: '#991b1b',
    background: 'white', outline: 'none', fontFamily: 'inherit',
  };

  const getColors = (i: number, total: number) => {
    if (i === total - 1) return { bg: '#f0fdf4', bd: '#22c55e', tx: '#14532d' };
    if (i === 0)         return { bg: '#fff1f2', bd: '#ef4444', tx: '#7f1d1d' };
    return                      { bg: '#fefce8', bd: '#eab308', tx: '#713f12' };
  };

  return (
    <div style={{
      background: 'white', border: '2px solid #fca5a5', borderRadius: 16,
      padding: '1.75rem', margin: '1.5rem 0',
      boxShadow: '0 4px 16px rgba(239,68,68,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🚗</span>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
            Thực hành: Bài toán chuyển động ngược chiều
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
            Nhập dữ liệu → xem sơ đồ và từng bước giải
          </p>
        </div>
      </div>

      {/* Diagram */}
      {!solved && <MotionDiagram S={S} t={t} xPct={xPct} />}

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.85rem' }}>Quãng đường AB:</span>
          <input type="number" value={S} onChange={e => setS(Number(e.target.value))} style={iSt} />
          <span style={{ fontWeight: 600, color: '#374151' }}>km</span>
          <span style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.85rem', marginLeft: 12 }}>Thời gian gặp nhau:</span>
          <input type="number" value={t} onChange={e => setT(Number(e.target.value))} style={iSt} />
          <span style={{ fontWeight: 600, color: '#374151' }}>giờ</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: '#374151', fontSize: '0.85rem' }}>Liên hệ vận tốc:</span>
          <select value={diffType} onChange={e => setDiffType(e.target.value as 'difference' | 'ratio')} style={{
            ...iSt, width: 120, fontWeight: 600, cursor: 'pointer',
          }}>
            <option value="difference">Hiệu vận tốc</option>
            <option value="ratio">Tỉ lệ vận tốc</option>
          </select>

          {diffType === 'difference' ? (
            <>
              <span style={{ fontWeight: 600, color: '#374151' }}>v₁ − v₂ =</span>
              <input type="number" value={diffVal} onChange={e => setDiffVal(Number(e.target.value))} style={iSt} />
              <span style={{ fontWeight: 600, color: '#374151' }}>km/h</span>
            </>
          ) : (
            <>
              <span style={{ fontWeight: 600, color: '#374151' }}>v₁ / v₂ =</span>
              <input type="number" value={ratioVal} onChange={e => setRatioVal(Number(e.target.value))} style={iSt} />
            </>
          )}
        </div>
      </div>

      {/* Solve button */}
      {!solved && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <button onClick={handleSolve} style={{
            background: '#dc2626', color: 'white', border: 'none',
            borderRadius: 999, padding: '0.6rem 1.75rem', fontFamily: 'inherit',
            fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(220,38,38,.25)',
          }}>
            🚗 Giải bài toán chuyển động
          </button>
        </div>
      )}

      {/* Steps */}
      {solved && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <MotionDiagram S={S} t={t} xPct={xPct} />
            <button onClick={handleReset} style={{
              background: 'white', color: '#64748b', border: '1.5px solid #e2e8f0',
              borderRadius: 999, padding: '0.3rem 1rem', fontFamily: 'inherit',
              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              marginLeft: 12, alignSelf: 'flex-start',
            }}>↩ Nhập lại</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {steps.slice(0, revealed).map((s, i) => {
              const { bg, bd, tx } = getColors(i, steps.length);
              return (
                <div key={i} style={{
                  background: bg, border: `2px solid ${bd}`, borderRadius: 12,
                  padding: '0.9rem 1.1rem', animation: 'motFade 0.3s ease',
                }}>
                  <div style={{
                    fontSize: '0.72rem', fontWeight: 800, color: bd,
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem',
                  }}>
                    {s.label}
                  </div>
                  {s.lines.map((ln, j) => (
                    <div key={j} style={{
                      fontFamily: 'inherit', fontSize: '0.95rem',
                      fontWeight: s.isResult ? 800 : 600,
                      color: tx, lineHeight: 1.9, whiteSpace: 'pre-wrap',
                    }}>
                      {ln}
                    </div>
                  ))}
                </div>
              );
            })}

            {revealed < steps.length && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
                <button onClick={() => setRevealed(r => r + 1)} style={{
                  background: '#f97316', color: 'white', border: 'none',
                  borderRadius: 999, padding: '0.55rem 1.6rem', fontFamily: 'inherit',
                  fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(249,115,22,.3)',
                }}>
                  ▶ Bước tiếp theo ({revealed}/{steps.length})
                </button>
              </div>
            )}

            {revealed === steps.length && steps.length > 0 && (
              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8', margin: '0.25rem 0 0' }}>
                ✨ Hoàn thành! Bấm "Nhập lại" để thử bài toán khác.
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes motFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
