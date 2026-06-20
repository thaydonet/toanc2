import React, { useState } from 'react';

export default function SystemOfEquationsSolver() {
  const [a1, setA1] = useState<number>(2);
  const [b1, setB1] = useState<number>(1);
  const [c1, setC1] = useState<number>(5);
  const [a2, setA2] = useState<number>(1);
  const [b2, setB2] = useState<number>(-1);
  const [c2, setC2] = useState<number>(1);
  const [solution, setSolution] = useState<{ xN?: number; xD?: number; yN?: number; yD?: number; type: 'unique' | 'infinite' | 'none' } | null>(null);
  const [hovered, setHovered] = useState(false);

  const solveSystem = () => {
    const D  = a1 * b2 - a2 * b1;
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;

    if (D === 0) {
      setSolution({ type: Dx === 0 && Dy === 0 ? 'infinite' : 'none' });
    } else {
      setSolution({ xN: Dx, xD: D, yN: Dy, yD: D, type: 'unique' });
    }
  };

  /** Hiển thị phân số tối giản: "3/4", "-5", "0" */
  const frac = (n: number, d: number): string => {
    if (d === 0) return '∞';
    if (n === 0) return '0';
    if (d < 0) { n = -n; d = -d; }
    const gcd = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
    const g = gcd(Math.abs(n), d);
    return (d / g === 1) ? String(n / g) : `${n / g}/${d / g}`;
  };

  const inputStyle: React.CSSProperties = {
    width: '60px',
    padding: '6px 4px',
    border: '2px solid #bfdbfe',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1d4ed8',
    background: 'white',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 150ms ease',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: '700',
    color: '#374151',
    fontSize: '1.05rem',
    userSelect: 'none',
  };

  return (
    <div style={{
      background: 'white',
      border: '2px solid #bfdbfe',
      borderRadius: '16px',
      padding: '1.75rem',
      margin: '1.5rem 0',
      boxShadow: '0 4px 16px rgba(59,130,246,0.08)',
    }}>
      {/* Header */}
      <h4 style={{
        fontSize: '1.15rem',
        fontWeight: '800',
        color: '#1d4ed8',
        textAlign: 'center',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}>
        🧮 Trình giải hệ phương trình bậc nhất hai ẩn
      </h4>

      {/* System display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}>
        {/* Big brace */}
        <span style={{ fontSize: '3rem', lineHeight: 1, color: '#1d4ed8', fontWeight: '300' }}>{'{'}</span>

        {/* Two equations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* Equation 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <input type="number" value={a1}
              onChange={e => setA1(Number(e.target.value))}
              style={inputStyle} />
            <span style={labelStyle}>x +</span>
            <input type="number" value={b1}
              onChange={e => setB1(Number(e.target.value))}
              style={inputStyle} />
            <span style={labelStyle}>y =</span>
            <input type="number" value={c1}
              onChange={e => setC1(Number(e.target.value))}
              style={inputStyle} />
          </div>
          {/* Equation 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <input type="number" value={a2}
              onChange={e => setA2(Number(e.target.value))}
              style={inputStyle} />
            <span style={labelStyle}>x +</span>
            <input type="number" value={b2}
              onChange={e => setB2(Number(e.target.value))}
              style={inputStyle} />
            <span style={labelStyle}>y =</span>
            <input type="number" value={c2}
              onChange={e => setC2(Number(e.target.value))}
              style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Hint */}
      <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>
        Nhập hệ số vào các ô rồi bấm <strong>Giải</strong>.
        Phương trình: <em>ax + by = c</em>
      </p>

      {/* Solve button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <button
          onClick={solveSystem}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: hovered ? '#1d4ed8' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '999px',
            padding: '0.6rem 2rem',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: hovered ? '0 6px 18px rgba(29,78,216,0.35)' : '0 4px 12px rgba(37,99,235,0.25)',
            transform: hovered ? 'translateY(-2px)' : 'none',
            transition: 'all 180ms ease',
          }}
        >
          Giải hệ phương trình
        </button>
      </div>

      {/* Result */}
      {solution && (
        <div style={{
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          borderLeft: '5px solid',
          ...(solution.type === 'unique'
            ? { background: '#f0fdf4', borderColor: '#22c55e' }
            : solution.type === 'infinite'
            ? { background: '#eff6ff', borderColor: '#3b82f6' }
            : { background: '#fff1f2', borderColor: '#ef4444' }),
        }}>
          {solution.type === 'unique' && (
            <>
              <p style={{ fontWeight: '700', color: '#15803d', marginBottom: '0.25rem' }}>✅ Hệ có nghiệm duy nhất:</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#14532d', letterSpacing: '0.02em' }}>
                x = {frac(solution.xN!, solution.xD!)} &nbsp;&nbsp; y = {frac(solution.yN!, solution.yD!)}
              </p>
              <p style={{ fontSize: '0.82rem', color: '#166534', marginTop: '0.35rem' }}>
                Cặp nghiệm: ({frac(solution.xN!, solution.xD!)}&nbsp;;&nbsp;{frac(solution.yN!, solution.yD!)})
              </p>
            </>
          )}
          {solution.type === 'infinite' && (
            <p style={{ fontWeight: '700', color: '#1d4ed8' }}>
              ♾️ Hệ phương trình có <strong>vô số nghiệm</strong> (hai phương trình tương đương nhau).
            </p>
          )}
          {solution.type === 'none' && (
            <p style={{ fontWeight: '700', color: '#dc2626' }}>
              ✗ Hệ phương trình <strong>vô nghiệm</strong> (hai đường thẳng song song nhau).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
