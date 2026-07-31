import { useState } from 'react';

/* ── Math helpers ─────────────────────────────────────────── */
function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

/** Hiển thị phân số tối giản: "3/4", "-5", "0" */
function frac(n: number, d: number = 1): string {
  if (d === 0) return '∞';
  if (n === 0) return '0';
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d);
  return (d / g === 1) ? String(n / g) : `${n / g}/${d / g}`;
}

/** Hệ số nguyên × biến trong chuỗi phương trình, ví dụ: "3x", " + 2y", " − y" */
function intCf(c: number, v: string, first: boolean): string {
  if (c === 0) return first ? '0' : '';
  const neg = c < 0, a = Math.abs(c);
  const pre = first ? (neg ? '−' : '') : (neg ? ' − ' : ' + ');
  return pre + (a === 1 ? '' : a) + v;
}

/** Hệ số phân số × biến để hiển thị trong biểu thức thế, ví dụ: " + 3y", " − (1/2)y" */
function varTerm(num: number, den: number, v: string): string {
  if (num === 0) return '';
  if (den < 0) { num = -num; den = -den; }
  const g = gcd(Math.abs(num), den);
  const n = num / g, d = den / g;
  const neg = n < 0, an = Math.abs(n);
  const cf = (d === 1 && an === 1) ? '' : (d === 1 ? String(an) : `(${an}/${d})`);
  return neg ? ` − ${cf}${v}` : ` + ${cf}${v}`;
}

/** Chuỗi phương trình: ax + by = c */
function eqStr(a: number, b: number, c: number): string {
  let s = '';
  if (a !== 0) s += intCf(a, 'x', true);
  if (b !== 0) s += intCf(b, 'y', s === '');
  return (s || '0') + ` = ${c}`;
}

/* ── Types ────────────────────────────────────────────────── */
interface Step { label: string; lines: string[]; isResult?: boolean; }

/* ── Solver logic ─────────────────────────────────────────── */
function buildSteps(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): Step[] {
  const steps: Step[] = [];
  const D = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  steps.push({
    label: 'Hệ phương trình ban đầu',
    lines: [`⎧ ${eqStr(a1, b1, c1)}   (1)`, `⎩ ${eqStr(a2, b2, c2)}   (2)`],
  });

  // Chọn phương trình và ẩn để biểu diễn (ưu tiên hệ số ±1)
  let fromEq: 1 | 2 = 1, exprVar: 'x' | 'y' = 'x';
  if      (a1 === 1 || a1 === -1) { fromEq = 1; exprVar = 'x'; }
  else if (b1 === 1 || b1 === -1) { fromEq = 1; exprVar = 'y'; }
  else if (a2 === 1 || a2 === -1) { fromEq = 2; exprVar = 'x'; }
  else if (b2 === 1 || b2 === -1) { fromEq = 2; exprVar = 'y'; }
  else if (a1 !== 0)              { fromEq = 1; exprVar = 'x'; }
  else if (b1 !== 0)              { fromEq = 1; exprVar = 'y'; }
  else if (a2 !== 0)              { fromEq = 2; exprVar = 'x'; }
  else                            { fromEq = 2; exprVar = 'y'; }

  const [ea, eb, ec] = fromEq === 1 ? [a1, b1, c1] : [a2, b2, c2];
  const [sa, sb, sc] = fromEq === 1 ? [a2, b2, c2] : [a1, b1, c1];
  const other = fromEq === 1 ? 2 : 1;

  if (exprVar === 'x') {
    if (ea === 0) {
      steps.push({ label: 'Lưu ý', lines: ['Hệ số x = 0, thử phương pháp khác.'] });
      return steps;
    }
    // x = ec/ea + (-eb/ea)·y
    const xExpr = frac(ec, ea) + varTerm(-eb, ea, 'y');

    steps.push({
      label: `Bước 1 — Biểu diễn x từ phương trình (${fromEq})`,
      lines: [`Từ (${fromEq}): ${eqStr(ea, eb, ec)}`, `→  x = ${xExpr}`],
    });

    // Sau khi thế vào pt(other) và rút gọn: yC·y = yR
    const yC = ea * sb - sa * eb; // = ±D
    const yR = sc * ea - sa * ec; // = ±Dy

    steps.push({
      label: `Bước 2 — Thế x = ${xExpr.length > 20 ? '...' : xExpr} vào (${other}), rút gọn`,
      lines: [
        `Thay vào (${other}): ${eqStr(sa, sb, sc)}`,
        `→  ${intCf(yC, 'y', true)} = ${yR}`,
      ],
    });

    if (yC === 0) {
      steps.push({
        label: 'Kết luận', isResult: true,
        lines: yR === 0
          ? ['Hệ có VÔ SỐ NGHIỆM', '(hai phương trình tương đương nhau)']
          : ['Hệ VÔ NGHIỆM', '(hai đường thẳng song song)'],
      });
      return steps;
    }

    const yFrac = frac(yR, yC);
    steps.push({
      label: 'Bước 3 — Tìm y',
      lines: [`${intCf(yC, 'y', true)} = ${yR}`, `→  y = ${yFrac}`],
    });

    const xFrac = frac(Dx, D);
    steps.push({
      label: 'Bước 4 — Thế y vào biểu thức, tìm x',
      lines: [
        `x = ${xExpr.replace('y', `(${yFrac})`)}`,
        `→  x = ${xFrac}`,
      ],
    });

  } else {
    if (eb === 0) {
      steps.push({ label: 'Lưu ý', lines: ['Hệ số y = 0, thử phương pháp khác.'] });
      return steps;
    }
    // y = ec/eb + (-ea/eb)·x
    const yExpr = frac(ec, eb) + varTerm(-ea, eb, 'x');

    steps.push({
      label: `Bước 1 — Biểu diễn y từ phương trình (${fromEq})`,
      lines: [`Từ (${fromEq}): ${eqStr(ea, eb, ec)}`, `→  y = ${yExpr}`],
    });

    const xC = sa * eb - sb * ea;
    const xR = sc * eb - sb * ec;

    steps.push({
      label: `Bước 2 — Thế y = ${yExpr.length > 20 ? '...' : yExpr} vào (${other}), rút gọn`,
      lines: [
        `Thay vào (${other}): ${eqStr(sa, sb, sc)}`,
        `→  ${intCf(xC, 'x', true)} = ${xR}`,
      ],
    });

    if (xC === 0) {
      steps.push({
        label: 'Kết luận', isResult: true,
        lines: xR === 0 ? ['Hệ có VÔ SỐ NGHIỆM'] : ['Hệ VÔ NGHIỆM'],
      });
      return steps;
    }

    const xFrac = frac(xR, xC);
    steps.push({
      label: 'Bước 3 — Tìm x',
      lines: [`${intCf(xC, 'x', true)} = ${xR}`, `→  x = ${xFrac}`],
    });

    const yFrac = frac(Dy, D);
    steps.push({
      label: 'Bước 4 — Thế x vào biểu thức, tìm y',
      lines: [
        `y = ${yExpr.replace('x', `(${xFrac})`)}`,
        `→  y = ${yFrac}`,
      ],
    });
  }

  steps.push({
    label: '✅ Kết luận nghiệm', isResult: true,
    lines: [
      'Hệ phương trình có nghiệm duy nhất:',
      `x = ${frac(Dx, D)}   ;   y = ${frac(Dy, D)}`,
    ],
  });

  return steps;
}

/* ── Random generator ─────────────────────────────────────── */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSystem() {
  // Đảm bảo có ít nhất một hệ số ±1 để dễ biểu diễn
  const which = randomInt(0, 3);
  let a1: number, b1: number, c1: number;
  let a2: number, b2: number, c2: number;
  do {
    a1 = randomInt(-5, 5); b1 = randomInt(-5, 5); c1 = randomInt(-5, 5);
    a2 = randomInt(-5, 5); b2 = randomInt(-5, 5); c2 = randomInt(-5, 5);
    // Đặt hệ số ±1 vào vị trí đã chọn
    const val = Math.random() < 0.5 ? 1 : -1;
    if (which === 0)      { a1 = val; }
    else if (which === 1) { b1 = val; }
    else if (which === 2) { a2 = val; }
    else                  { b2 = val; }
  } while (
    (a1 === 0 && b1 === 0) || (a2 === 0 && b2 === 0) ||
    (a1 * b2 - a2 * b1 === 0) // hệ suy biến
  );
  return { a1, b1, c1, a2, b2, c2 };
}

/* ── Component ────────────────────────────────────────────── */
export default function SubstitutionSolver() {
  const [a1, setA1] = useState(1),  [b1, setB1] = useState(-3), [c1, setC1] = useState(2);
  const [a2, setA2] = useState(-2), [b2, setB2] = useState(5),  [c2, setC2] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [solved, setSolved] = useState(false);

  const handleSolve = () => {
    setSteps(buildSteps(a1, b1, c1, a2, b2, c2));
    setSolved(true); setRevealed(1);
  };
  const handleReset = () => {
    const sys = randomSystem();
    setA1(sys.a1); setB1(sys.b1); setC1(sys.c1);
    setA2(sys.a2); setB2(sys.b2); setC2(sys.c2);
    setSolved(false); setSteps([]); setRevealed(0);
  };

  const iSt: React.CSSProperties = {
    width: 56, padding: '6px 4px', textAlign: 'center',
    border: '2px solid #bfdbfe', borderRadius: 8,
    fontWeight: 700, fontSize: '1rem', color: '#1d4ed8',
    background: 'white', outline: 'none', fontFamily: 'inherit',
  };

  const getColors = (i: number, total: number) => {
    if (i === total - 1) return { bg: '#f0fdf4', bd: '#22c55e', tx: '#14532d' };
    if (i === 0)         return { bg: '#eff6ff', bd: '#3b82f6', tx: '#1e40af' };
    return                      { bg: '#faf5ff', bd: '#a78bfa', tx: '#4c1d95' };
  };

  const rows = [
    { a: a1, sA: setA1, b: b1, sB: setB1, c: c1, sC: setC1, lbl: '(1)' },
    { a: a2, sA: setA2, b: b2, sB: setB2, c: c2, sC: setC2, lbl: '(2)' },
  ];

  return (
    <div style={{
      background: 'white', border: '2px solid #bfdbfe', borderRadius: 16,
      padding: '1.75rem', margin: '1.5rem 0',
      boxShadow: '0 4px 16px rgba(59,130,246,0.08)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🔁</span>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8', margin: 0 }}>
            Thực hành: Phương pháp thế
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
            Nhập hệ số → xem từng bước giải chi tiết
          </p>
        </div>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '2.8rem', lineHeight: 1, color: '#1d4ed8', fontWeight: 300 }}>{'{'}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {rows.map(({ a, sA, b, sB, c, sC, lbl }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <input type="number" value={a} onChange={e => sA(Number(e.target.value))} style={iSt} />
              <span style={{ fontWeight: 700, color: '#374151' }}>x +</span>
              <input type="number" value={b} onChange={e => sB(Number(e.target.value))} style={iSt} />
              <span style={{ fontWeight: 700, color: '#374151' }}>y =</span>
              <input type="number" value={c} onChange={e => sC(Number(e.target.value))} style={iSt} />
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Solve button */}
      {!solved && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <button onClick={handleSolve} style={{
            background: '#2563eb', color: 'white', border: 'none',
            borderRadius: 999, padding: '0.6rem 1.75rem', fontFamily: 'inherit',
            fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,.25)',
            transition: 'all 180ms ease',
          }}>
            🔍 Giải từng bước
          </button>
        </div>
      )}

      {/* Steps */}
      {solved && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
            <button onClick={handleReset} style={{
              background: 'white', color: '#64748b', border: '1.5px solid #e2e8f0',
              borderRadius: 999, padding: '0.3rem 1rem', fontFamily: 'inherit',
              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
            }}>↩ Nhập lại</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {steps.slice(0, revealed).map((s, i) => {
              const { bg, bd, tx } = getColors(i, steps.length);
              return (
                <div key={i} style={{
                  background: bg, border: `2px solid ${bd}`, borderRadius: 12,
                  padding: '0.9rem 1.1rem', animation: 'subFade 0.3s ease',
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
                      color: tx, lineHeight: 1.9,
                    }}>
                      {ln}
                    </div>
                  ))}
                </div>
              );
            })}

            {/* ▶ Nút DƯỚI khung vừa hiện */}
            {revealed < steps.length && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
                <button
                  onClick={() => setRevealed(r => r + 1)}
                  style={{
                    background: '#7c3aed', color: 'white', border: 'none',
                    borderRadius: 999, padding: '0.55rem 1.6rem', fontFamily: 'inherit',
                    fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(124,58,237,.3)',
                    transition: 'all 180ms ease',
                  }}
                >
                  ▶ Bước tiếp theo ({revealed}/{steps.length})
                </button>
              </div>
            )}

            {revealed === steps.length && steps.length > 0 && (
              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8', margin: '0.25rem 0 0' }}>
                ✨ Hoàn thành! Bấm "Nhập lại" để thử hệ khác.
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes subFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
