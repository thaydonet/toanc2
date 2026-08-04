import { useState } from 'react';

interface CauHoi {
  q: string;
  ans: string;
  wrong: string[];
  gt: string;
}

const POOL: CauHoi[] = [
  { q: 'Tam giác ABC có góc A = 50°, góc B = 60°. Góc C bằng?', ans: '70°', wrong: ['80°', '110°', '100°'], gt: 'Góc C = 180° − 50° − 60° = 70°.' },
  { q: 'Tổng ba góc trong một tam giác bằng?', ans: '180°', wrong: ['90°', '360°', '270°'], gt: 'Định lí: tổng ba góc trong một tam giác bằng 180°.' },
  { q: 'Tam giác vuông có một góc nhọn 35°. Góc nhọn còn lại bằng?', ans: '55°', wrong: ['65°', '45°', '145°'], gt: 'Hai góc nhọn trong tam giác vuông phụ nhau: 90° − 35° = 55°.' },
  { q: 'Tam giác đều có mỗi góc bằng?', ans: '60°', wrong: ['45°', '90°', '120°'], gt: 'Tam giác đều có ba góc bằng nhau: 180° : 3 = 60°.' },
  { q: 'Góc ngoài tại một đỉnh của tam giác bằng?', ans: 'Tổng hai góc trong không kề với nó', wrong: ['Góc trong tại đỉnh đó', 'Tổng ba góc', 'Luôn bằng 180°'], gt: 'Định lí góc ngoài: bằng tổng hai góc trong không kề với nó.' },
  { q: 'Tam giác cân có góc ở đỉnh 40°. Mỗi góc ở đáy bằng?', ans: '70°', wrong: ['60°', '80°', '140°'], gt: '(180° − 40°) : 2 = 70°.' },
  { q: 'Tam giác ABC có góc A gấp đôi góc B và góc B = góc C. Góc A bằng?', ans: '90°', wrong: ['60°', '45°', '72°'], gt: 'Gọi góc B = x thì 2x + x + x = 180° ⇒ x = 45°, góc A = 90°.' },
  { q: 'Tam giác vuông cân có hai góc nhọn mỗi góc bằng?', ans: '45°', wrong: ['60°', '30°', '90°'], gt: '(180° − 90°) : 2 = 45°.' },
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

export default function TongBaGocTamGiacInteractive() {
  const [state, setState] = useState(() => {
    const it = pick(POOL);
    return { item: it, order: shuffle([it.ans, ...it.wrong]) };
  });
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const next = () => {
    const it = pick(POOL);
    setState({ item: it, order: shuffle([it.ans, ...it.wrong]) });
    setPicked(null);
  };
  const ans = state.item.ans;
  const pickOpt = (opt: string) => {
    if (picked !== null) return;
    setPicked(opt);
    setTotal(t => t + 1);
    if (opt === ans) setScore(s => s + 1);
  };

  return (
    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.25rem' }}>△</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Tổng các góc trong tam giác</h3>
      </div>

      <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>{state.item.q}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {state.order.map((opt, i) => {
            const isC = opt === ans;
            let s: React.CSSProperties = { padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #cbd5e1', background: '#fff', cursor: 'pointer', textAlign: 'center', fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' };
            if (picked === opt) { s.borderColor = '#2563eb'; s.background = '#eff6ff'; }
            if (picked !== null) {
              if (isC) { s.borderColor = '#22c55e'; s.background = '#f0fdf4'; s.color = '#15803d'; }
              else if (picked === opt) { s.borderColor = '#ef4444'; s.background = '#fef2f2'; s.color = '#b91c1c'; }
            }
            return <button key={i} disabled={picked !== null} onClick={() => pickOpt(opt)} style={s}>{opt}</button>;
          })}
        </div>
        {picked === null ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button onClick={next} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>🎲 Câu hỏi mới</button>
            <span style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Điểm: {score}/{total}</span>
          </div>
        ) : (
          <div>
            <div style={{ padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '0.8rem', background: picked === ans ? '#dcfce7' : '#fee2e2', color: picked === ans ? '#166534' : '#991b1b', border: `1px solid ${picked === ans ? '#86efac' : '#fca5a5'}` }}>
              <strong>{picked === ans ? '🎉 Chính xác!' : '❌ Chưa đúng!'}</strong> {state.item.gt}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button onClick={next} style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#059669', color: '#fff' }}>🎲 Câu hỏi tiếp theo</button>
              <span style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Điểm: {score}/{total}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
