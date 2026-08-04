import { useState } from 'react';

interface CauHoi {
  q: string;
  ans: string;
  wrong: string[];
  gt: string;
}

const POOL: CauHoi[] = [
  { q: 'Hai tam giác vuông có hai cạnh góc vuông tương ứng bằng nhau thì?', ans: 'Bằng nhau (c.g.c)', wrong: ['Chưa chắc bằng nhau', 'Không bằng nhau', 'Bằng nhau theo c.c.c'], gt: 'Hai cạnh góc vuông và góc xen giữa 90° bằng nhau ⇒ hai tam giác vuông bằng nhau (c.g.c).' },
  { q: 'Trường hợp cạnh huyền – góc nhọn là?', ans: 'Cạnh huyền và một góc nhọn tương ứng bằng nhau', wrong: ['Chỉ cạnh huyền bằng nhau', 'Chỉ góc nhọn bằng nhau', 'Ba cạnh bằng nhau'], gt: 'Nếu cạnh huyền và một góc nhọn của hai tam giác vuông bằng nhau thì hai tam giác vuông bằng nhau.' },
  { q: 'Trường hợp cạnh huyền – cạnh góc vuông là?', ans: 'Cạnh huyền và một cạnh góc vuông tương ứng bằng nhau', wrong: ['Hai cạnh huyền bằng nhau', 'Hai cạnh góc vuông bằng nhau', 'Một góc nhọn bằng nhau'], gt: 'Nếu cạnh huyền và một cạnh góc vuông của hai tam giác vuông bằng nhau thì hai tam giác vuông bằng nhau.' },
  { q: 'Một cạnh góc vuông và góc nhọn kề tương ứng bằng nhau thì hai tam giác vuông?', ans: 'Bằng nhau (g.c.g)', wrong: ['Chưa chắc', 'Không bằng nhau', 'Bằng nhau theo cạnh huyền'], gt: 'Cạnh góc vuông, góc nhọn kề và góc vuông 90° tương ứng bằng nhau ⇒ bằng nhau theo g.c.g.' },
  { q: 'Cho ΔABC và ΔDEF vuông tại A và D, có BC = EF, góc B = góc E. Hai tam giác bằng nhau theo?', ans: 'Cạnh huyền – góc nhọn', wrong: ['Hai cạnh góc vuông', 'c.c.c', 'Không xác định'], gt: 'Cạnh huyền BC = EF và góc nhọn B = E ⇒ bằng nhau theo cạnh huyền – góc nhọn.' },
  { q: 'Cho ΔABC vuông tại A, AB = AC, AH ⊥ BC. ΔABH = ΔACH theo trường hợp nào?', ans: 'Cạnh huyền – cạnh góc vuông', wrong: ['Hai cạnh góc vuông', 'c.g.c', 'g.c.g'], gt: 'AB = AC (cạnh huyền), AH chung (cạnh góc vuông) ⇒ cạnh huyền – cạnh góc vuông.' },
  { q: 'Tam giác vuông có mấy trường hợp bằng nhau?', ans: '4', wrong: ['3', '2', '5'], gt: 'Hai cạnh góc vuông; cạnh góc vuông – góc nhọn kề; cạnh huyền – góc nhọn; cạnh huyền – cạnh góc vuông.' },
  { q: 'Hai tam giác vuông chỉ có cạnh huyền bằng nhau thì?', ans: 'Chưa chắc bằng nhau', wrong: ['Luôn bằng nhau', 'Không bao giờ bằng nhau', 'Bằng nhau theo cạnh huyền'], gt: 'Cần thêm một góc nhọn hoặc một cạnh góc vuông tương ứng bằng nhau nữa.' },
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

export default function TamGiacVuongBangNhauInteractive() {
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
        <span style={{ fontSize: '1.25rem' }}>∟</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Các trường hợp bằng nhau của tam giác vuông</h3>
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
