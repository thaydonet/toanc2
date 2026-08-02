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
    prompt: 'Để biểu diễn tỉ lệ phần trăm (%) của các phần so với toàn thể, loại biểu đồ nào thích hợp nhất?',
    latexExpression: '\\text{Biểu diễn tỉ lệ phần trăm}',
    options: ['Biểu đồ hình quạt tròn', 'Biểu đồ đoạn thẳng', 'Biểu đồ cột đơn', 'Bảng số liệu thô'],
    correctIndex: 0,
    solution: 'Biểu đồ hình quạt tròn là lựa chọn tối ưu nhất để biểu diễn tỉ lệ % của từng thành phần so với tổng thể 100%.',
  },
  {
    id: 2,
    prompt: 'Để biểu diễn sự thay đổi của một đại lượng theo thời gian (xu hướng phát triển), loại biểu đồ nào thích hợp nhất?',
    latexExpression: '\\text{Biểu diễn sự thay đổi theo thời gian}',
    options: ['Biểu đồ đoạn thẳng (hoặc đường)', 'Biểu đồ hình quạt tròn', 'Biểu đồ cột đôi', 'Bảng thống kê ban đầu'],
    correctIndex: 0,
    solution: 'Biểu đồ đoạn thẳng giúp thể hiện rõ nét xu hướng tăng/giảm của dữ liệu qua các mốc thời gian.',
  },
  {
    id: 3,
    prompt: 'Một biểu đồ hình quạt tròn biểu diễn tỉ lệ học sinh tham gia các câu lạc bộ. Góc ở tâm tương ứng với nhóm học sinh chiếm 25% là bao nhiêu độ?',
    latexExpression: '\\alpha = 25\\% \\cdot 360^\\circ',
    options: ['90^\\circ', '45^\\circ', '180^\\circ', '120^\\circ'],
    correctIndex: 0,
    solution: 'Góc ở tâm tương ứng $= 25\\% \\cdot 360^\\circ = 0.25 \\cdot 360^\\circ = 90^\\circ$.',
  },
  {
    id: 4,
    prompt: 'Loại biểu đồ nào thích hợp để so sánh 2 tập dữ liệu của cùng một đối tượng tại nhiều thời điểm?',
    latexExpression: '\\text{So sánh 2 bộ dữ liệu}',
    options: ['Biểu đồ cột kép', 'Biểu đồ quạt tròn', 'Biểu đồ cột đơn', 'Sơ đồ hình học'],
    correctIndex: 0,
    solution: 'Biểu đồ cột kép cho phép so sánh trực quan hai đại lượng khác nhau (ví dụ: nam và nữ, năm 2022 và năm 2023) trên cùng một trục.',
  },
  {
    id: 5,
    prompt: 'Góc ở tâm của hình quạt tròn biểu diễn 100% dữ liệu bằng bao nhiêu độ?',
    latexExpression: '100\\% \\leftrightarrow ?',
    options: ['360^\\circ', '180^\\circ', '90^\\circ', '270^\\circ'],
    correctIndex: 0,
    solution: 'Toàn bộ đường tròn ứng với 100% bằng $360^\\circ$.',
  },
];

export default function BieuDienDuLieuInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Biểu diễn dữ liệu bằng Bảng & Biểu đồ</h4>
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
