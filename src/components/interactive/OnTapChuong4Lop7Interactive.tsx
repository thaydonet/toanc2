import { useState } from 'react';

interface CauHoi {
  q: string;
  ans: string;
  wrong: string[];
  gt: string;
}

const POOL: CauHoi[] = [
  { q: 'Tổng ba góc trong một tam giác bằng?', ans: '180°', wrong: ['90°', '360°', '270°'], gt: 'Định lí tổng ba góc trong một tam giác bằng 180°.' },
  { q: 'Hai tam giác có ba cạnh tương ứng bằng nhau thì bằng nhau theo trường hợp?', ans: 'c.c.c', wrong: ['c.g.c', 'g.c.g', 'Không xác định'], gt: 'c.c.c: ba cạnh của tam giác này bằng ba cạnh của tam giác kia.' },
  { q: 'Trường hợp c.g.c yêu cầu điều kiện gì?', ans: 'Hai cạnh và góc xen giữa tương ứng bằng nhau', wrong: ['Ba cạnh tương ứng bằng nhau', 'Một cạnh và hai góc kề', 'Ba góc tương ứng bằng nhau'], gt: 'c.g.c: hai cạnh và góc xen giữa của tam giác này bằng hai cạnh và góc xen giữa của tam giác kia.' },
  { q: 'Trường hợp cạnh huyền – cạnh góc vuông là trường hợp bằng nhau của?', ans: 'Tam giác vuông', wrong: ['Tam giác thường', 'Tam giác đều', 'Tam giác cân'], gt: 'Đây là trường hợp đặc biệt dành riêng cho tam giác vuông.' },
  { q: 'Tam giác cân tại A có góc A = 50°. Mỗi góc ở đáy bằng?', ans: '65°', wrong: ['50°', '80°', '130°'], gt: 'Góc B = góc C = (180° − 50°) : 2 = 65°.' },
  { q: 'Điểm cách đều hai đầu mút của một đoạn thẳng thì nằm trên?', ans: 'Đường trung trực của đoạn thẳng đó', wrong: ['Đường phân giác của một góc', 'Đường cao', 'Đường trung tuyến'], gt: 'Định lí đảo: điểm cách đều hai đầu mút của đoạn thẳng thì nằm trên đường trung trực của nó.' },
  { q: 'Góc ngoài của tam giác bằng?', ans: 'Tổng hai góc trong không kề với nó', wrong: ['Tổng ba góc trong', 'Góc trong kề bù với nó', 'Luôn bằng 180°'], gt: 'Định lí: góc ngoài của tam giác bằng tổng hai góc trong không kề với nó.' },
  { q: 'Tam giác vuông có một góc nhọn 25°. Góc nhọn còn lại bằng?', ans: '65°', wrong: ['55°', '75°', '155°'], gt: 'Hai góc nhọn phụ nhau: 90° − 25° = 65°.' },
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

export default function OnTapChuong4Lop7Interactive() {
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
        <span style={{ fontSize: '1.25rem' }}>🧩</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Ôn tập Chương 4 — Tam giác bằng nhau</h3>
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
