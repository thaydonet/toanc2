import { useState } from 'react';

interface CauHoi {
  q: string;
  ans: string;
  wrong: string[];
  gt: string;
}

const POOL: CauHoi[] = [
  { q: 'Biểu đồ đoạn thẳng thích hợp để biểu diễn?', ans: 'Sự thay đổi của dữ liệu theo thời gian', wrong: ['Tỉ lệ phần trăm của các bộ phận', 'Số lượng cố định', 'Màu sắc của các đối tượng'], gt: 'Biểu đồ đoạn thẳng thể hiện xu hướng thay đổi của dữ liệu theo thời gian.' },
  { q: 'Trục ngang của biểu đồ đoạn thẳng thường biểu diễn?', ans: 'Thời gian (tháng, năm, ngày...)', wrong: ['Giá trị dữ liệu', 'Tỉ lệ phần trăm', 'Số lượng lớn'], gt: 'Trục ngang (Ox) biểu diễn thời gian, trục dọc (Oy) biểu diễn giá trị dữ liệu.' },
  { q: 'Đường đi lên trong biểu đồ đoạn thẳng thể hiện?', ans: 'Dữ liệu tăng theo thời gian', wrong: ['Dữ liệu giảm theo thời gian', 'Dữ liệu không đổi', 'Không có dữ liệu'], gt: 'Đường đi lên thể hiện giá trị tăng theo thời gian.' },
  { q: 'Nhiệt độ tăng từ 25°C lên 30°C thì tăng?', ans: '5°C', wrong: ['3°C', '6°C', '10°C'], gt: '30 − 25 = 5°C.' },
  { q: 'Trong biểu đồ đoạn thẳng, các điểm dữ liệu được nối với nhau bằng?', ans: 'Các đoạn thẳng', wrong: ['Các đường cong', 'Các mũi tên', 'Không nối'], gt: 'Các điểm dữ liệu được nối bởi các đoạn thẳng tạo thành đường gấp khúc.' },
  { q: 'Điểm cao nhất trên biểu đồ đoạn thẳng tương ứng với?', ans: 'Giá trị lớn nhất của dữ liệu', wrong: ['Giá trị nhỏ nhất', 'Giá trị trung bình', 'Mốt của dữ liệu'], gt: 'Điểm cao nhất cho biết giá trị lớn nhất của dữ liệu.' },
  { q: 'Vì sao biểu đồ đoạn thẳng giúp dự đoán xu hướng tương lai?', ans: 'Vì thể hiện rõ xu hướng tăng, giảm', wrong: ['Vì không thể hiện xu hướng', 'Vì chỉ dùng cho số nhỏ', 'Vì rất khó đọc'], gt: 'Dựa vào xu hướng hiện tại có thể dự đoán giá trị ở thời điểm tương lai.' },
  { q: 'Doanh số 6 tháng: 50, 55, 60, 58, 65, 70 (triệu đồng). Tháng nào cao nhất?', ans: 'Tháng 6 (70 triệu)', wrong: ['Tháng 1 (50 triệu)', 'Tháng 3 (60 triệu)', 'Tháng 4 (58 triệu)'], gt: 'Giá trị lớn nhất là 70 triệu đồng ở tháng 6.' },
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

export default function BieuDoDoanThangInteractive() {
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
        <span style={{ fontSize: '1.25rem' }}>📈</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Thực hành: Biểu đồ đoạn thẳng</h3>
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
