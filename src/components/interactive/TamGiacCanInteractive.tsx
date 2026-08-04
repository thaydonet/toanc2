import { useState } from 'react';

interface CauHoi {
  q: string;
  ans: string;
  wrong: string[];
  gt: string;
}

const POOL: CauHoi[] = [
  { q: 'Tam giác cân là tam giác có?', ans: 'Hai cạnh bằng nhau', wrong: ['Ba cạnh bằng nhau', 'Hai góc vuông', 'Ba góc nhọn'], gt: 'Tam giác cân là tam giác có hai cạnh bằng nhau (hai cạnh bên).' },
  { q: 'Trong tam giác cân, hai góc ở đáy?', ans: 'Bằng nhau', wrong: ['Hơn kém nhau 10°', 'Phụ nhau', 'Bù nhau'], gt: 'Tính chất: tam giác cân có hai góc ở đáy bằng nhau.' },
  { q: 'Tam giác cân tại A có góc A = 40°. Góc B bằng?', ans: '70°', wrong: ['60°', '80°', '140°'], gt: 'Góc B = góc C = (180° − 40°) : 2 = 70°.' },
  { q: 'Đường trung trực của đoạn thẳng AB là?', ans: 'Đường thẳng vuông góc với AB tại trung điểm của AB', wrong: ['Đường thẳng đi qua trung điểm của AB', 'Đường thẳng vuông góc với AB', 'Đường thẳng chia đôi một góc'], gt: 'Đường trung trực của đoạn thẳng là đường thẳng vuông góc với đoạn thẳng tại trung điểm của nó.' },
  { q: 'Điểm M nằm trên đường trung trực của đoạn thẳng AB thì?', ans: 'MA = MB', wrong: ['MA = 2MB', 'MA < MB', 'M trùng với trung điểm'], gt: 'Định lí: điểm nằm trên đường trung trực thì cách đều hai đầu mút của đoạn thẳng.' },
  { q: 'Nếu MA = MB thì điểm M nằm trên?', ans: 'Đường trung trực của đoạn thẳng AB', wrong: ['Đường phân giác của góc A', 'Đường cao của AB', 'Không xác định'], gt: 'Định lí đảo: điểm cách đều hai đầu mút của đoạn thẳng thì nằm trên đường trung trực của nó.' },
  { q: 'Trong tam giác cân, đường cao xuất phát từ đỉnh đồng thời là?', ans: 'Trung tuyến, phân giác, trung trực của cạnh đáy', wrong: ['Chỉ là đường trung tuyến', 'Chỉ là đường phân giác', 'Chỉ là đường trung trực'], gt: 'Đường cao từ đỉnh tam giác cân đồng thời là trung tuyến, phân giác và trung trực của cạnh đáy.' },
  { q: 'Tam giác có hai góc bằng nhau thì tam giác đó?', ans: 'Là tam giác cân', wrong: ['Là tam giác đều', 'Là tam giác vuông', 'Là tam giác vuông cân'], gt: 'Định lí đảo: tam giác có hai góc bằng nhau là tam giác cân.' },
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

export default function TamGiacCanInteractive() {
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
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Tam giác cân và đường trung trực</h3>
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
