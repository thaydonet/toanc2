import { useState } from 'react';

interface CauHoi {
  q: string;
  ans: string;
  wrong: string[];
  gt: string;
}

const POOL: CauHoi[] = [
  { q: 'Hai tam giác bằng nhau khi nào?', ans: 'Các cạnh và góc tương ứng bằng nhau', wrong: ['Chỉ các cạnh bằng nhau', 'Chỉ các góc bằng nhau', 'Có diện tích bằng nhau'], gt: 'Hai tam giác bằng nhau khi các cạnh tương ứng và các góc tương ứng bằng nhau.' },
  { q: 'Trường hợp bằng nhau c.c.c là gì?', ans: 'Ba cạnh của tam giác này bằng ba cạnh của tam giác kia', wrong: ['Ba góc bằng nhau', 'Hai cạnh và góc xen giữa', 'Một cạnh và hai góc kề'], gt: 'c.c.c: nếu ba cạnh của tam giác này bằng ba cạnh của tam giác kia thì hai tam giác bằng nhau.' },
  { q: 'Cho ΔABC = ΔDEF. Cạnh tương ứng với AB là?', ans: 'DE', wrong: ['EF', 'DF', 'FD'], gt: 'Viết theo thứ tự đỉnh A↔D, B↔E, C↔F nên cạnh AB tương ứng với cạnh DE.' },
  { q: 'Cho ΔABC = ΔDEF. Góc tương ứng với góc B là?', ans: 'Góc E', wrong: ['Góc D', 'Góc F', 'Góc A'], gt: 'Theo thứ tự đỉnh A↔D, B↔E, C↔F nên góc B tương ứng với góc E.' },
  { q: 'Để chứng minh hai tam giác bằng nhau theo c.c.c cần?', ans: 'Ba cặp cạnh tương ứng bằng nhau', wrong: ['Ba góc tương ứng bằng nhau', 'Hai cặp cạnh bằng nhau', 'Một cặp cạnh và một góc'], gt: 'Trường hợp c.c.c yêu cầu ba cặp cạnh tương ứng bằng nhau.' },
  { q: 'Cho ΔABC có AB = AC, M là trung điểm BC. ΔABM = ΔACM theo trường hợp nào?', ans: 'c.c.c', wrong: ['c.g.c', 'g.c.g', 'Không thể kết luận'], gt: 'AB = AC (gt), BM = CM (M là trung điểm), AM chung ⇒ ΔABM = ΔACM theo c.c.c.' },
  { q: 'Nếu ΔABC = ΔDEF và AB = 5 cm thì?', ans: 'DE = 5 cm', wrong: ['EF = 5 cm', 'DF = 5 cm', 'Không xác định'], gt: 'Cạnh AB tương ứng với DE nên DE = AB = 5 cm.' },
  { q: 'Cho ΔABC = ΔMNP và góc A = 60°. Khẳng định nào đúng?', ans: 'Góc M = 60°', wrong: ['Góc N = 60°', 'Góc P = 60°', 'Góc B = 60°'], gt: 'Đỉnh A tương ứng với đỉnh M nên góc A = góc M = 60°.' },
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

export default function HaiTamGiacBangNhauInteractive() {
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
        <span style={{ fontSize: '1.25rem' }}>≅</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Hai tam giác bằng nhau (c.c.c)</h3>
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
