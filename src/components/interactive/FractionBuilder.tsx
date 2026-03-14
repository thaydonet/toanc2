import { useState, useCallback } from 'react';

interface Props {
  initialNumerator?: number;
  initialDenominator?: number;
}

export default function FractionBuilder({ initialNumerator = 1, initialDenominator = 4 }: Props) {
  const [num, setNum] = useState(initialNumerator);
  const [den, setDen] = useState(initialDenominator);

  const gcd = useCallback((a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b), []);
  const g = gcd(num, den);
  const simplified = { n: num / g, d: den / g };
  const isReduced = g === 1;
  const percentage = den > 0 ? Math.round((num / den) * 100) : 0;

  const slices = Array.from({ length: den }, (_, i) => {
    const startAngle = (i / den) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const r = 80, cx = 90, cy = 90;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle),   y2 = cy + r * Math.sin(endAngle);
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    return (
      <path key={i}
        d={`M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
        fill={i < num ? '#3b82f6' : '#e2e8f0'}
        stroke="white" strokeWidth="2.5"
        style={{ transition: 'fill 0.25s', cursor: 'pointer' }}
        onClick={() => setNum(i < num ? i : i + 1)}
      />
    );
  });

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
        {/* Pie SVG */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <svg viewBox="0 0 180 180" width="180" height="180">
            <circle cx="90" cy="90" r="82" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2"/>
            {slices}
            <circle cx="90" cy="90" r="82" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
          </svg>
          <p style={{ fontSize: '.85rem', color: '#64748b', textAlign: 'center' }}>
            💡 Nhấp vào miếng bánh để thay đổi
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Fraction display */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '2.5rem', fontWeight: 800 }}>
              <span style={{ color: '#3b82f6' }}>{num}</span>
              <div style={{ width: '60px', height: '3px', background: '#1e293b', borderRadius: '99px' }} />
              <span>{den}</span>
            </div>
            <div style={{ color: '#64748b', fontSize: '1rem', marginTop: '.5rem' }}>{percentage}%</div>
          </div>

          {/* Sliders */}
          <div>
            <label style={{ fontSize: '.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '.4rem' }}>
              Tử số: <strong style={{ color: '#3b82f6' }}>{num}</strong>
            </label>
            <input type="range" min={0} max={den} value={num} onChange={e => setNum(Number(e.target.value))} />
          </div>
          <div>
            <label style={{ fontSize: '.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '.4rem' }}>
              Mẫu số: <strong>{den}</strong>
            </label>
            <input type="range" min={1} max={12} value={den} onChange={e => {
              const d = Number(e.target.value);
              setDen(d);
              if (num > d) setNum(d);
            }} />
          </div>

          {/* Simplified */}
          <div style={{
            padding: '.75rem 1rem', borderRadius: '10px',
            background: isReduced ? '#dcfce7' : '#dbeafe',
            border: `2px solid ${isReduced ? '#86efac' : '#93c5fd'}`
          }}>
            <p style={{ fontSize: '.875rem', fontWeight: 600, color: isReduced ? '#14532d' : '#1e40af' }}>
              {isReduced
                ? `✅ ${num}/${den} là phân số tối giản`
                : `🔽 Rút gọn: ${num}/${den} = ${simplified.n}/${simplified.d} (chia ${g})`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
