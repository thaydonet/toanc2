import { useState } from 'react';

/* ── Math helpers ─────────────────────────────────────────── */
function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

/** Hiển thị phân số tối giản */
function frac(n: number, d: number = 1): string {
  if (d === 0) return '∞';
  if (n === 0) return '0';
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d);
  return (d / g === 1) ? String(n / g) : `${n / g}/${d / g}`;
}

/** Hệ số nguyên × biến trong chuỗi phương trình */
function intCf(c: number, v: string, first: boolean): string {
  if (c === 0) return first ? '0' : '';
  const neg = c < 0, a = Math.abs(c);
  const pre = first ? (neg ? '−' : '') : (neg ? ' − ' : ' + ');
  return pre + (a === 1 ? '' : a) + v;
}

/** Chuỗi phương trình ax + by = c */
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
  const D  = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  steps.push({
    label: 'Hệ phương trình ban đầu',
    lines: [`⎧ ${eqStr(a1, b1, c1)}   (1)`, `⎩ ${eqStr(a2, b2, c2)}   (2)`],
  });

  // Xử lý đặc biệt khi a1 = 0 hoặc a2 = 0
  if (a1 === 0 && a2 === 0) {
    steps.push({ label: 'Kết luận', isResult: true, lines: ['Hệ chỉ có ẩn y, không xác định x.'] });
    return steps;
  }

  if (a1 === 0) {
    // Pt(1) chỉ có y, dùng ngay
    if (b1 === 0) {
      steps.push({ label: 'Kết luận', isResult: true, lines: [c1 === 0 ? 'Hệ có VÔ SỐ NGHIỆM' : 'Hệ VÔ NGHIỆM'] });
      return steps;
    }
    const yFrac = frac(c1, b1);
    steps.push({ label: 'Bước 1 — Từ (1) tìm ngay y', lines: [`${intCf(b1, 'y', true)} = ${c1}`, `→  y = ${yFrac}`] });
    const xNum = c2 * b1 - b2 * c1; // a2*x = c2 - b2*(c1/b1)
    const xFrac = frac(Dx, D);
    steps.push({ label: 'Bước 2 — Thế vào (2) tìm x', lines: [`Thay y = ${yFrac} vào (2): ${eqStr(a2, b2, c2)}`, `→  x = ${xFrac}`] });
    steps.push({ label: '✅ Kết luận nghiệm', isResult: true, lines: [`x = ${xFrac}   ;   y = ${yFrac}`] });
    return steps;
  }

  if (a2 === 0) {
    if (b2 === 0) {
      steps.push({ label: 'Kết luận', isResult: true, lines: [c2 === 0 ? 'Hệ có VÔ SỐ NGHIỆM' : 'Hệ VÔ NGHIỆM'] });
      return steps;
    }
    const yFrac = frac(c2, b2);
    steps.push({ label: 'Bước 1 — Từ (2) tìm ngay y', lines: [`${intCf(b2, 'y', true)} = ${c2}`, `→  y = ${yFrac}`] });
    const xFrac = frac(Dx, D);
    steps.push({ label: 'Bước 2 — Thế vào (1) tìm x', lines: [`Thay y = ${yFrac} vào (1): ${eqStr(a1, b1, c1)}`, `→  x = ${xFrac}`] });
    steps.push({ label: '✅ Kết luận nghiệm', isResult: true, lines: [`x = ${xFrac}   ;   y = ${yFrac}`] });
    return steps;
  }

  // ── Trường hợp thông thường: cả a1 ≠ 0 và a2 ≠ 0 ──────────
  const g  = gcd(Math.abs(a1), Math.abs(a2));
  const k1 = Math.abs(a2) / g;   // nhân pt(1) với k1
  const k2 = Math.abs(a1) / g;   // nhân pt(2) với k2

  const na1 = k1 * a1, nb1 = k1 * b1, nc1 = k1 * c1;
  const na2 = k2 * a2, nb2 = k2 * b2, nc2 = k2 * c2;

  // Hiển thị bước nhân (chỉ khi thực sự cần)
  if (k1 !== 1 || k2 !== 1) {
    const lines: string[] = [];
    if (k1 !== 1) lines.push(`Nhân (1) với ${k1}: ${eqStr(na1, nb1, nc1)}   (1')`);
    else           lines.push(`Giữ nguyên (1): ${eqStr(na1, nb1, nc1)}   (1')`);
    if (k2 !== 1) lines.push(`Nhân (2) với ${k2}: ${eqStr(na2, nb2, nc2)}   (2')`);
    else           lines.push(`Giữ nguyên (2): ${eqStr(na2, nb2, nc2)}   (2')`);
    steps.push({ label: 'Bước 1 — Nhân để cùng hệ số |x|', lines });
  } else {
    steps.push({
      label: 'Bước 1 — Hai phương trình đã có |hệ số x| bằng nhau',
      lines: [`|${a1}| = |${a2}| = ${Math.abs(a1)}, không cần nhân thêm`],
    });
  }

  // Cộng hay trừ?
  const sameSign = (na1 > 0 && na2 > 0) || (na1 < 0 && na2 < 0);

  // Tính kết quả: chọn chiều cho hệ số y dương nếu được
  let yCoef: number, yRHS: number, opStr: string;
  if (sameSign) {
    const opt1 = { yC: nb2 - nb1, yR: nc2 - nc1, op: "(2') − (1')" };
    const opt2 = { yC: nb1 - nb2, yR: nc1 - nc2, op: "(1') − (2')" };
    const chosen = opt1.yC >= 0 ? opt1 : opt2;
    yCoef = chosen.yC; yRHS = chosen.yR; opStr = chosen.op;
  } else {
    yCoef = nb1 + nb2; yRHS = nc1 + nc2; opStr = "(1') + (2')";
  }

  steps.push({
    label: `Bước 2 — ${sameSign ? 'Trừ' : 'Cộng'} vế để khử ẩn x`,
    lines: [
      `Thực hiện ${opStr}: ẩn x bị triệt tiêu`,
      `→  ${intCf(yCoef, 'y', true)} = ${yRHS}`,
    ],
  });

  if (yCoef === 0) {
    steps.push({
      label: 'Kết luận', isResult: true,
      lines: yRHS === 0
        ? ['Hệ có VÔ SỐ NGHIỆM (hai pt tương đương)']
        : ['Hệ VÔ NGHIỆM (hai đường thẳng song song)'],
    });
    return steps;
  }

  const yFrac = frac(yRHS, yCoef);
  steps.push({
    label: 'Bước 3 — Tìm y',
    lines: [`${intCf(yCoef, 'y', true)} = ${yRHS}`, `→  y = ${yFrac}`],
  });

  // Thế ngược vào pt(1) để tìm x
  // a1·x + b1·y = c1 → a1·x = c1 - b1·(Dy/D)
  // a1·x = (c1·D - b1·Dy) / D = a1·Dx / D
  const rhsNum = c1 * D - b1 * Dy; // = a1·Dx
  const xFrac  = frac(Dx, D);

  steps.push({
    label: 'Bước 4 — Thế y vào (1), tìm x',
    lines: [
      `Thay y = ${yFrac} vào (1): ${eqStr(a1, b1, c1)}`,
      `→  ${intCf(a1, 'x', true)} = ${frac(rhsNum, D)}`,
      `→  x = ${xFrac}`,
    ],
  });

  steps.push({
    label: '✅ Kết luận nghiệm', isResult: true,
    lines: [
      'Hệ phương trình có nghiệm duy nhất:',
      `x = ${frac(Dx, D)}   ;   y = ${frac(Dy, D)}`,
    ],
  });

  return steps;
}

/* ── Component ────────────────────────────────────────────── */
export default function AdditionSolver() {
  const [a1, setA1] = useState(2),  [b1, setB1] = useState(1),  [c1, setC1] = useState(3);
  const [a2, setA2] = useState(1),  [b2, setB2] = useState(-1), [c2, setC2] = useState(6);
  const [steps, setSteps] = useState<Step[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [solved, setSolved] = useState(false);

  const handleSolve = () => {
    setSteps(buildSteps(a1, b1, c1, a2, b2, c2));
    setSolved(true); setRevealed(1);
  };
  const handleReset = () => { setSolved(false); setSteps([]); setRevealed(0); };

  const iSt: React.CSSProperties = {
    width: 56, padding: '6px 4px', textAlign: 'center',
    border: '2px solid #99f6e4', borderRadius: 8,
    fontWeight: 700, fontSize: '1rem', color: '#0f766e',
    background: 'white', outline: 'none', fontFamily: 'inherit',
  };

  const getColors = (i: number, total: number) => {
    if (i === total - 1) return { bg: '#f0fdf4', bd: '#22c55e', tx: '#14532d' };
    if (i === 0)         return { bg: '#f0fdfa', bd: '#14b8a6', tx: '#134e4a' };
    return                      { bg: '#fff7ed', bd: '#f97316', tx: '#7c2d12' };
  };

  const rows = [
    { a: a1, sA: setA1, b: b1, sB: setB1, c: c1, sC: setC1, lbl: '(1)' },
    { a: a2, sA: setA2, b: b2, sB: setB2, c: c2, sC: setC2, lbl: '(2)' },
  ];

  return (
    <div style={{
      background: 'white', border: '2px solid #99f6e4', borderRadius: 16,
      padding: '1.75rem', margin: '1.5rem 0',
      boxShadow: '0 4px 16px rgba(20,184,166,0.08)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.5rem' }}>➕</span>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f766e', margin: 0 }}>
            Thực hành: Phương pháp cộng đại số
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
            Nhập hệ số → xem từng bước giải chi tiết
          </p>
        </div>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '2.8rem', lineHeight: 1, color: '#0f766e', fontWeight: 300 }}>{'{'}</span>
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

      {/* Hint */}
      <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>
        Công cụ tự tính bội số tối ưu (dùng ƯCLN) để triệt tiêu ẩn x.
      </p>

      {/* Solve button */}
      {!solved && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <button onClick={handleSolve} style={{
            background: '#0d9488', color: 'white', border: 'none',
            borderRadius: 999, padding: '0.6rem 1.75rem', fontFamily: 'inherit',
            fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(13,148,136,.25)',
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
                  padding: '0.9rem 1.1rem', animation: 'addFade 0.3s ease',
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
                    background: '#f97316', color: 'white', border: 'none',
                    borderRadius: 999, padding: '0.55rem 1.6rem', fontFamily: 'inherit',
                    fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(249,115,22,.3)',
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
        @keyframes addFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
