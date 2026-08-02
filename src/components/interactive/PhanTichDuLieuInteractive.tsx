import React, { useState, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const KatexDisplay = ({ math, block = false }: { math: string; block?: boolean }) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(math, {
          displayMode: block,
          throwOnError: false,
        }),
      }}
    />
  );
};

interface Problem {
  id: number;
  prompt: string;
  latexExpression: string;
  options: string[];
  correctIndex: number;
  solution: string;
}

const PROBLEMS: Problem[] = [
  {
    id: 1,
    prompt: 'Bảng thống kê số học sinh giỏi 4 lớp 8: 8A (12), 8B (15), 8C (10), 8D (18). Lớp nào có số học sinh giỏi nhiều nhất và chiếm tỉ lệ bao nhiêu % so với tổng số 55 học sinh giỏi?',
    latexExpression: '\\text{Tỉ lệ lớp 8D} = \\dfrac{18}{55} \\cdot 100\\%',
    options: ['Lớp 8D, chiếm khoảng 32.7%', 'Lớp 8B, chiếm khoảng 27.3%', 'Lớp 8A, chiếm khoảng 21.8%', 'Lớp 8C, chiếm khoảng 18.2%'],
    correctIndex: 0,
    solution: 'Lớp 8D có 18 học sinh giỏi (nhiều nhất). Tỉ lệ $= \\dfrac{18}{55} \\cdot 100\\% \\approx 32.7\\%$.',
  },
  {
    id: 2,
    prompt: 'Mục đích chính của việc phân tích dữ liệu qua bảng và biểu đồ là gì?',
    latexExpression: '\\text{Mục đích phân tích dữ liệu}',
    options: ['Rút ra kết luận, phát hiện xu hướng và hỗ trợ đưa ra quyết định', 'Làm cho bài thuyết trình đẹp hơn', 'Thay thế hoàn toàn việc tính toán toán học', 'Tăng dung lượng lưu trữ của máy tính'],
    correctIndex: 0,
    solution: 'Phân tích dữ liệu giúp ta đọc hiểu ý nghĩa thực tế, dự báo xu hướng và đưa ra các quyết định chính xác.',
  },
  {
    id: 3,
    prompt: 'Khi đọc một biểu đồ cột thể hiện doanh số bán hàng 4 quý, cột Quý 4 cao gấp đôi Quý 1 (Quý 1 bán được 50 triệu). Doanh số Quý 4 bằng bao nhiêu?',
    latexExpression: '50 \\cdot 2 = ?',
    options: ['100 \\text{ triệu}', '150 \\text{ triệu}', '200 \\text{ triệu}', '75 \\text{ triệu}'],
    correctIndex: 0,
    solution: 'Doanh số Quý 4 $= 50 \\cdot 2 = 100$ triệu đồng.',
  },
  {
    id: 4,
    prompt: 'Một biểu đồ đường biểu diễn nhiệt độ từ 6h đến 18h: 6h (22°C), 12h (34°C), 18h (28°C). Nhiệt độ tăng mạnh nhất trong khoảng thời gian nào?',
    latexExpression: '\\text{Độ tăng nhiệt độ}',
    options: ['Từ 6h đến 12h (tăng 12°C)', 'Từ 12h đến 18h', 'Không thay đổi', 'Từ 18h trở đi'],
    correctIndex: 0,
    solution: 'Từ 6h đến 12h nhiệt độ tăng $34 - 22 = 12^\circ\text{C}$ (mức tăng cao nhất).',
  },
  {
    id: 5,
    prompt: 'Nếu trong biểu đồ đoạn thẳng có một điểm chênh lệch bất thường so với xu hướng chung, ta gọi đó là gì?',
    latexExpression: '\\text{Dữ liệu bất thường}',
    options: ['Điểm dữ liệu bất thường (hoặc giá trị ngoại lệ)', 'Dữ liệu chuẩn', 'Dữ liệu trung bình', 'Dữ liệu tỉ lệ'],
    correctIndex: 0,
    solution: 'Các giá trị tăng giảm đột biến bất thường được gọi là giá trị bất thường / ngoại lệ cần kiểm tra lại.',
  },
];

export default function PhanTichDuLieuInteractive() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [correctOptionString, setCorrectOptionString] = useState<string>('');

  const currentProblem = PROBLEMS[currentIndex];

  useEffect(() => {
    const opts = [...currentProblem.options];
    const correctStr = opts[currentProblem.correctIndex];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    setShuffledOptions(opts);
    setCorrectOptionString(correctStr);
    setSelectedIndex(null);
    setIsSubmitted(false);
  }, [currentIndex]);

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setIsSubmitted(true);
    if (shuffledOptions[selectedIndex] === correctOptionString) {
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    const nextIdx = Math.floor(Math.random() * PROBLEMS.length);
    setCurrentIndex(nextIdx);
  };

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', margin: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Phân tích & Rút ra kết luận từ Dữ liệu</h4>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>⭐ Điểm: {score}</span>
          <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>🔥 Chuỗi: {streak}</span>
        </div>
      </div>

      <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 0.75rem 0', fontWeight: 600, color: '#334155' }}>{currentProblem.prompt}</p>
        <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f1f5f9', borderRadius: '6px', fontSize: '1.2rem' }}>
          <KatexDisplay math={currentProblem.latexExpression} block={true} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        {shuffledOptions.map((opt, idx) => {
          let btnStyle: React.CSSProperties = {
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '2px solid #cbd5e1',
            background: 'white',
            cursor: 'pointer',
            textAlign: 'center',
            fontSize: '1rem',
            transition: 'all 0.2s',
          };

          if (selectedIndex === idx) {
            btnStyle.borderColor = '#2563eb';
            btnStyle.background = '#eff6ff';
          }

          if (isSubmitted) {
            if (opt === correctOptionString) {
              btnStyle.borderColor = '#22c55e';
              btnStyle.background = '#f0fdf4';
              btnStyle.color = '#15803d';
              btnStyle.fontWeight = 'bold';
            } else if (selectedIndex === idx) {
              btnStyle.borderColor = '#ef4444';
              btnStyle.background = '#fef2f2';
              btnStyle.color = '#b91c1c';
            }
          }

          return (
            <button
              key={idx}
              disabled={isSubmitted}
              onClick={() => setSelectedIndex(idx)}
              style={btnStyle}
            >
              <KatexDisplay math={opt} />
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedIndex === null}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: selectedIndex !== null ? '#2563eb' : '#94a3b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: selectedIndex !== null ? 'pointer' : 'not-allowed',
          }}
        >
          Xác nhận đáp án
        </button>
      ) : (
        <div>
          <div style={{ background: shuffledOptions[selectedIndex!] === correctOptionString ? '#f0fdf4' : '#fef2f2', border: `1px solid ${shuffledOptions[selectedIndex!] === correctOptionString ? '#86efac' : '#fca5a5'}`, borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontWeight: 600, color: shuffledOptions[selectedIndex!] === correctOptionString ? '#15803d' : '#b91c1c' }}>
              {shuffledOptions[selectedIndex!] === correctOptionString ? '🎉 Chính xác!' : '❌ Chưa đúng rồi!'}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem', color: '#334155' }}>
              <strong>Lời giải:</strong> <KatexDisplay math={currentProblem.solution} />
            </p>
          </div>
          <button
            onClick={handleNext}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Câu hỏi tiếp theo ➔
          </button>
        </div>
      )}
    </div>
  );
}
