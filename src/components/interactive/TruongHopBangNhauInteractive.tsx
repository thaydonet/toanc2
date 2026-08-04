import { useState } from 'react';

interface CauHoi {
  q: string;
  ans: string;
  wrong: string[];
  gt: string;
}

const POOL: CauHoi[] = [
  { q: 'Trường hợp bằng nhau c.g.c là gì?', ans: 'Hai cạnh và góc xen giữa tương ứng bằng nhau', wrong: ['Ba cạnh bằng nhau', 'Hai cạnh và một góc bất kỳ', 'Một cạnh và hai góc kề'], gt: 'c.g.c: nếu hai cạnh và góc xen giữa của tam giác này bằng hai cạnh và góc xen giữa của tam giác kia.' },
  { q: 'Trường hợp bằng nhau g.c.g là gì?', ans: 'Một cạnh và hai góc kề cạnh đó tương ứng bằng nhau', wrong: ['Ba góc bằng nhau', 'Hai cạnh và góc xen giữa', 'Một góc và hai cạnh'], gt: 'g.c.g: nếu một cạnh và hai góc kề cạnh đó của tam giác này bằng một cạnh và hai góc kề của tam giác kia.' },
  { q: 'Góc xen giữa hai cạnh AB và AC là?', ans: 'Góc A', wrong: ['Góc B', 'Góc C', 'Góc ngoài'], gt: 'Góc tạo bởi hai cạnh AB và AC là góc BAC (góc A).' },
  { q: 'Hai góc kề cạnh BC của tam giác ABC là?', ans: 'Góc B và góc C', wrong: ['Góc A và góc B', 'Góc A và góc C', 'Góc A và góc ngoài'], gt: 'Hai góc kề cạnh BC là góc B (đầu B) và góc C (đầu C).' },
  { q: 'Cho ΔABC và ΔDEF có AB = DE, góc A = góc D, AC = DF. Hai tam giác bằng nhau theo?', ans: 'c.g.c', wrong: ['c.c.c', 'g.c.g', 'Không xác định'], gt: 'Hai cạnh AB, AC và góc xen giữa A tương ứng bằng nhau ⇒ ΔABC = ΔDEF (c.g.c).' },
  { q: 'Cho ΔABC và ΔDEF có góc B = góc E, BC = EF, góc C = góc F. Hai tam giác bằng nhau theo?', ans: 'g.c.g', wrong: ['c.c.c', 'c.g.c', 'Không xác định'], gt: 'Cạnh BC và hai góc kề B, C tương ứng bằng nhau ⇒ ΔABC = ΔDEF (g.c.g).' },
  { q: 'Để dùng c.g.c chứng minh ΔABC = ΔDEF ta cần?', ans: 'Hai cạnh và góc xen giữa tương ứng bằng nhau', wrong: ['Ba cạnh tương ứng bằng nhau', 'Ba góc tương ứng bằng nhau', 'Một cạnh và hai góc kề'], gt: 'c.g.c yêu cầu hai cạnh và góc xen giữa của hai tam giác bằng nhau.' },
  { q: 'Hai tam giác có ba góc tương ứng bằng nhau thì?', ans: 'Chưa chắc đã bằng nhau', wrong: ['Luôn bằng nhau', 'Không bao giờ bằng nhau', 'Bằng nhau theo c.g.c'], gt: 'Ba góc bằng nhau chưa đủ điều kiện; cần có ít nhất một cạnh tương ứng bằng nhau.' },
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

export default function TruongHopBangNhauInteractive() {
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
        <span style={{ fontSize: '1.25rem' }}>📐</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Trường hợp bằng nhau c.g.c và g.c.g</h3>
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
