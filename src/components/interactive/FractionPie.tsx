import { useState } from 'react';

interface Props {
  numerator?: number;
  denominator?: number;
  size?: number;
}

export default function FractionPie({ numerator = 3, denominator = 8, size = 160 }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const slices = Array.from({ length: denominator }, (_, i) => {
    const s = (i / denominator) * 2 * Math.PI - Math.PI / 2;
    const e = ((i + 1) / denominator) * 2 * Math.PI - Math.PI / 2;
    const r = size / 2 - 8, cx = size / 2, cy = size / 2;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const largeArc = e - s > Math.PI ? 1 : 0;
    const mid = (s + e) / 2;
    const lr = r * 0.65;
    const filled = i < numerator;
    const hover = hovered === i;

    return (
      <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
        <path
          d={`M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
          fill={filled ? (hover ? '#2563eb' : '#3b82f6') : (hover ? '#d1d5db' : '#e2e8f0')}
          stroke="white" strokeWidth="2.5"
          style={{ transition: 'fill .2s, transform .2s', transformOrigin: `${cx}px ${cy}px`, transform: hover ? 'scale(1.05)' : 'scale(1)' }}
        />
        {denominator <= 12 && (
          <text x={cx + lr * Math.cos(mid)} y={cy + lr * Math.sin(mid) + 4}
            textAnchor="middle" fontSize={denominator <= 6 ? 13 : 10} fontWeight="700"
            fill={filled ? 'rgba(255,255,255,0.9)' : '#94a3b8'}>{i + 1}</text>
        )}
      </g>
    );
  });

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={size/2-6} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2"/>
        {slices}
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
          <span style={{ color: '#3b82f6' }}>{numerator}</span>
          <div style={{ width: '40px', height: '2.5px', background: '#1e293b', margin: '3px 0', borderRadius: '99px' }} />
          <span>{denominator}</span>
        </div>
        <div style={{ fontSize: '.8rem', color: '#94a3b8', marginTop: '4px' }}>
          ≈ {(numerator / denominator).toFixed(3)}
        </div>
      </div>
    </div>
  );
}
