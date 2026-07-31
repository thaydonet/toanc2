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

function buildSolveSteps(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): Step[] {
  const D = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  if (D === 0) {
    const msg = (Dx === 0 && Dy === 0)
      ? ['Hệ có VÔ SỐ NGHIỆM (hai phương trình tương đương)']
      : ['Hệ VÔ NGHIỆM (hai đường thẳng song song)'];
    return [{ label: 'Kết luận', isResult: true, lines: msg }];
  }

  // Chọn phương pháp: ưu tiên cộng đại số nếu có thể
  const preferAddition = (a1 !== 0 && a2 !== 0) || (b1 !== 0 && b2 !== 0);
  const steps: Step[] = [];

  if (preferAddition) {
    // Khử x
    const gx = gcd(Math.abs(a1), Math.abs(a2));
    const k1 = Math.abs(a2) / gx;
    const k2 = Math.abs(a1) / gx;

    if (k1 !== 1 || k2 !== 1) {
      const lines: string[] = [];
      if (k1 !== 1) lines.push(`Nhân (1) với ${k1}: ${eqStr(k1*a1, k1*b1, k1*c1)}   (1')`);
      if (k2 !== 1) lines.push(`Nhân (2) với ${k2}: ${eqStr(k2*a2, k2*b2, k2*c2)}   (2')`);
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
      lines: [
        `Thực hiện ${opStr}:`,
        `→  ${intCf(yCoef, 'y', true)} = ${yRHS}`,
      ],
    });

    if (yCoef === 0) {
      return steps;
    }

    const yFrac = frac(yRHS, yCoef);
    steps.push({
      label: 'Tìm y',
      lines: [`y = ${yFrac}`],
    });

    // Thế ngược tìm x
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
  } else {
    // Phương pháp thế (dự phòng)
    let fromEq = 1, exprVar: 'x' | 'y' = 'x';
    let [ea, eb, ec] = [a1, b1, c1];
    let [sa, sb, sc] = [a2, b2, c2];
    if (a1 === 0 && b1 === 0) { [ea, eb, ec] = [a2, b2, c2]; [sa, sb, sc] = [a1, b1, c1]; fromEq = 2; }

    if (exprVar === 'x' && ea !== 0) {
      const xExpr = frac(ec, ea) + (eb !== 0 ? ` − ${frac(eb, ea)}y` : '');
      steps.push({ label: 'Biểu diễn x', lines: [`x = ${xExpr}`] });
      const yC = ea * sb - sa * eb;
      const yR = sc * ea - sa * ec;
      if (yC !== 0) {
        const yF = frac(yR, yC);
        steps.push({ label: 'Tìm y', lines: [`y = ${yF}`] });
        steps.push({ label: 'Thế y để tìm x', lines: [`x = ${frac(Dx, D)}`] });
      }
    } else if (eb !== 0) {
      const yExpr = frac(ec, eb) + (ea !== 0 ? ` − ${frac(ea, eb)}x` : '');
      steps.push({ label: 'Biểu diễn y', lines: [`y = ${yExpr}`] });
      const xC = sa * eb - sb * ea;
      const xR = sc * eb - sb * ec;
      if (xC !== 0) {
        const xF = frac(xR, xC);
        steps.push({ label: 'Tìm x', lines: [`x = ${xF}`] });
        steps.push({ label: 'Thế x để tìm y', lines: [`y = ${frac(Dy, D)}`] });
      }
    }
  }

  steps.push({
    label: '✅ Nghiệm của hệ', isResult: true,
    lines: [`x = ${frac(Dx, D)}   ;   y = ${frac(Dy, D)}`],
  });

  return steps;
}

export default function WordProblemSolver() {
  const [item1, setItem1] = useState('cam');
  const [item2, setItem2] = useState('táo');
  const [unit, setUnit] = useState('kg');
  const [q1a, setQ1a] = useState(3);
  const [q1b, setQ1b] = useState(2);
  const [t1, setT1] = useState(250000);
  const [q2a, setQ2a] = useState(2);
  const [q2b, setQ2b] = useState(4);
  const [t2, setT2] = useState(300000);

  const [steps, setSteps] = useState<Step[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [solved, setSolved] = useState(false);

  const handleSolve = () => {
    const fmt = (n: number) => n.toLocaleString();
    const s: Step[] = [];

    s.push({
      label: 'Bước 1 — Chọn ẩn và đặt điều kiện',
      lines: [
        `Gọi x = giá 1 ${unit} ${item1} (đồng)`,
        `Gọi y = giá 1 ${unit} ${item2} (đồng)`,
        'Điều kiện: x > 0, y > 0',
      ],
    });

    s.push({
      label: `Bước 2 — Lập phương trình (1)`,
      lines: [
        `Lần 1: mua ${q1a} ${unit} ${item1} và ${q1b} ${unit} ${item2} hết ${fmt(t1)} đồng`,
        `→  ${q1a !== 1 ? q1a : ''}x + ${q1b !== 1 ? q1b : ''}y = ${t1}`,
      ],
    });

    s.push({
      label: `Bước 3 — Lập phương trình (2)`,
      lines: [
        `Lần 2: mua ${q2a} ${unit} ${item1} và ${q2b} ${unit} ${item2} hết ${fmt(t2)} đồng`,
        `→  ${q2a !== 1 ? q2a : ''}x + ${q2b !== 1 ? q2b : ''}y = ${t2}`,
        ``,
        `Hệ phương trình:`,
        `⎧ ${eqStr(q1a, q1b, t1)}`,
        `⎩ ${eqStr(q2a, q2b, t2)}`,
      ],
    });

    const solveSteps = buildSolveSteps(q1a, q1b, t1, q2a, q2b, t2);
    s.push(...solveSteps);

    const D = q1a * q2b - q2a * q1b;
    if (D !== 0) {
      const Dx = t1 * q2b - t2 * q1b;
      const Dy = q1a * t2 - q2a * t1;
      const xVal = Dx / D;
      const yVal = Dy / D;
      const check1 = q1a * xVal + q1b * yVal;
      const check2 = q2a * xVal + q2b * yVal;

      s.push({
        label: '✅ Kết luận bài toán', isResult: true,
        lines: [
          `Giá 1 ${unit} ${item1}: x = ${fmt(xVal)} đồng`,
          `Giá 1 ${unit} ${item2}: y = ${fmt(yVal)} đồng`,
          `Kiểm tra:`,
          `  Lần 1: ${q1a}×${fmt(xVal)} + ${q1b}×${fmt(yVal)} = ${fmt(check1)} ${check1 === t1 ? '✓' : '✗'}`,
          `  Lần 2: ${q2a}×${fmt(xVal)} + ${q2b}×${fmt(yVal)} = ${fmt(check2)} ${check2 === t2 ? '✓' : '✗'}`,
        ],
      });
    }

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
    border: '2px solid #d8b4fe', borderRadius: 8,
    fontWeight: 700, fontSize: '1rem', color: '#6b21a8',
    background: 'white', outline: 'none', fontFamily: 'inherit',
  };
  const iStTxt: React.CSSProperties = {
    width: 72, padding: '6px 8px',
    border: '2px solid #d8b4fe', borderRadius: 8,
    fontWeight: 600, fontSize: '0.9rem', color: '#6b21a8',
    background: 'white', outline: 'none', fontFamily: 'inherit',
  };

  const getColors = (i: number, total: number) => {
    if (i === total - 1) return { bg: '#f0fdf4', bd: '#22c55e', tx: '#14532d' };
    if (i === 0)         return { bg: '#f5f3ff', bd: '#7c3aed', tx: '#3b0764' };
    return                      { bg: '#fefce8', bd: '#eab308', tx: '#713f12' };
  };

  return (
    <div style={{
      background: 'white', border: '2px solid #d8b4fe', borderRadius: 16,
      padding: '1.75rem', margin: '1.5rem 0',
      boxShadow: '0 4px 16px rgba(124,58,237,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.5rem' }}>📝</span>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6b21a8', margin: 0 }}>
            Thực hành: Lập hệ phương trình từ bài toán thực tế
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
            Nhập dữ liệu → xem từng bước lập hệ và giải
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* Item names + unit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Mặt hàng 1:</span>
          <input value={item1} onChange={e => setItem1(e.target.value)} style={iStTxt} />
          <span style={{ fontWeight: 600, color: '#374151' }}>Mặt hàng 2:</span>
          <input value={item2} onChange={e => setItem2(e.target.value)} style={iStTxt} />
          <span style={{ fontWeight: 600, color: '#374151' }}>Đơn vị:</span>
          <input value={unit} onChange={e => setUnit(e.target.value)} style={{...iStTxt, width: 48}} />
        </div>

        {/* Purchase 1 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: '#6b21a8', fontSize: '0.85rem' }}>Lần 1:</span>
          <input type="number" value={q1a} onChange={e => setQ1a(Number(e.target.value))} style={iSt} />
          <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.88rem' }}>{unit} {item1} +</span>
          <input type="number" value={q1b} onChange={e => setQ1b(Number(e.target.value))} style={iSt} />
          <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.88rem' }}>{unit} {item2} =</span>
          <input type="number" value={t1} onChange={e => setT1(Number(e.target.value))} style={iSt} />
          <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.82rem' }}>đồng</span>
        </div>

        {/* Purchase 2 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: '#6b21a8', fontSize: '0.85rem' }}>Lần 2:</span>
          <input type="number" value={q2a} onChange={e => setQ2a(Number(e.target.value))} style={iSt} />
          <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.88rem' }}>{unit} {item1} +</span>
          <input type="number" value={q2b} onChange={e => setQ2b(Number(e.target.value))} style={iSt} />
          <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.88rem' }}>{unit} {item2} =</span>
          <input type="number" value={t2} onChange={e => setT2(Number(e.target.value))} style={iSt} />
          <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.82rem' }}>đồng</span>
        </div>
      </div>

      {/* Solve button */}
      {!solved && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <button onClick={handleSolve} style={{
            background: '#7c3aed', color: 'white', border: 'none',
            borderRadius: 999, padding: '0.6rem 1.75rem', fontFamily: 'inherit',
            fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(124,58,237,.25)',
          }}>
            📝 Lập hệ phương trình
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
                  padding: '0.9rem 1.1rem', animation: 'wpFade 0.3s ease',
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
                  background: '#eab308', color: 'white', border: 'none',
                  borderRadius: 999, padding: '0.55rem 1.6rem', fontFamily: 'inherit',
                  fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(234,179,8,.3)',
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
        @keyframes wpFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
