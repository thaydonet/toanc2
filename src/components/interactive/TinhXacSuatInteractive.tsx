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
    prompt: 'Xác suất của biến cố A trong một phép thử có các kết quả đồng khả năng được tính bằng công thức nào?',
    latexExpression: 'P(A) = ?',
    options: ['P(A) = \\dfrac{n(A)}{N}', 'P(A) = \\dfrac{N}{n(A)}', 'P(A) = n(A) \\cdot N', 'P(A) = N - n(A)'],
    correctIndex: 0,
    solution: 'Công thức xác suất cổ điển: P(A) = n(A) / N (bằng số kết quả thuận lợi chia cho tổng số kết quả có thể).',
  },
  {
    id: 2,
    prompt: 'Gieo 1 con xúc xắc cân đối 6 mặt. Xác suất xuất hiện mặt có số chấm chia hết cho 3 là:',
    latexExpression: 'A = \\{3; 6\\} \\Rightarrow P(A) = ?',
    options: ['\\dfrac{1}{3}', '\\dfrac{1}{6}', '\\dfrac{1}{2}', '\\dfrac{2}{3}'],
    correctIndex: 0,
    solution: 'Số kết quả thuận lợi là {3, 6} (2 kết quả). P(A) = 2 / 6 = 1/3.',
  },
  {
    id: 3,
    prompt: 'Một túi chứa 3 viên bi đỏ và 5 viên bi xanh có cùng kích thước. Lấy ngẫu nhiên 1 viên bi. Xác suất lấy được bi đỏ là:',
    latexExpression: 'P(\\text{Đỏ}) = ?',
    options: ['\\dfrac{3}{8}', '\\dfrac{5}{8}', '\\dfrac{3}{5}', '\\dfrac{1}{8}'],
    correctIndex: 0,
    solution: 'Tổng số bi N = 3 + 5 = 8 viên. Xác suất lấy được bi đỏ = 3 / 8.',
  },
  {
    id: 4,
    prompt: 'Rút ngẫu nhiên 1 lá bài từ bộ bài 52 lá. Xác suất rút được lá Át (Ace) là:',
    latexExpression: 'P(Át) = \\dfrac{4}{52} = ?',
    options: ['\\dfrac{1}{13}', '\\dfrac{1}{52}', '\\dfrac{4}{13}', '\\dfrac{1}{4}'],
    correctIndex: 0,
    solution: 'Bộ bài 52 lá có 4 lá Át. P(Át) = 4 / 52 = 1/13.',
  },
  {
    id: 5,
    prompt: 'Xác suất của một biến cố chắc chắn luôn bằng bao nhiêu?',
    latexExpression: 'P(\\text{Chắc chắn}) = ?',
    options: ['1', '0', '0.5', '100'],
    correctIndex: 0,
    solution: 'Biến cố chắc chắn luôn có xác suất bằng 1 (hoặc 100%).',
  },
];

export default function TinhXacSuatInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Cách tính Xác suất biến cố bằng tỉ số</h4>
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
