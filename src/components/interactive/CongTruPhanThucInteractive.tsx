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
    prompt: 'Thực hiện phép tính \\dfrac{x + 1}{x} + \\dfrac{2x - 1}{x} được kết quả:',
    latexExpression: '\\dfrac{(x + 1) + (2x - 1)}{x} = ?',
    options: ['3', '\\dfrac{3x}{x}', '3x', '\\dfrac{3x + 2}{x}'],
    correctIndex: 0,
    solution: '\\dfrac{x + 1 + 2x - 1}{x} = \\dfrac{3x}{x} = 3.',
  },
  {
    id: 2,
    prompt: 'Thực hiện phép tính \\dfrac{1}{x - 1} - \\dfrac{1}{x + 1} được kết quả:',
    latexExpression: '\\dfrac{(x + 1) - (x - 1)}{x^2 - 1} = ?',
    options: ['\\dfrac{2}{x^2 - 1}', '\\dfrac{0}{x^2 - 1}', '\\dfrac{2x}{x^2 - 1}', '\\dfrac{-2}{x^2 - 1}'],
    correctIndex: 0,
    solution: '\\dfrac{x + 1 - (x - 1)}{(x - 1)(x + 1)} = \\dfrac{2}{x^2 - 1}.',
  },
  {
    id: 3,
    prompt: 'Phân thức đối của phân thức \\dfrac{x - 2}{x + 3} là:',
    latexExpression: '-\\left(\\dfrac{x - 2}{x + 3}\\right) = ?',
    options: ['\\dfrac{2 - x}{x + 3}', '\\dfrac{x - 2}{-x - 3}', '\\dfrac{x + 2}{x + 3}', '\\dfrac{-x - 2}{x + 3}'],
    correctIndex: 0,
    solution: 'Phân thức đối: -\\dfrac{x - 2}{x + 3} = \\dfrac{-(x - 2)}{x + 3} = \\dfrac{2 - x}{x + 3}.',
  },
  {
    id: 4,
    prompt: 'Thực hiện phép tính \\dfrac{x^2}{x - 2} + \\dfrac{4}{2 - x} được kết quả:',
    latexExpression: '\\dfrac{x^2 - 4}{x - 2} = ?',
    options: ['x + 2', 'x - 2', '\\dfrac{x^2 + 4}{x - 2}', '2'],
    correctIndex: 0,
    solution: 'Đổi dấu phân thức thứ hai: \\dfrac{x^2}{x - 2} - \\dfrac{4}{x - 2} = \\dfrac{x^2 - 4}{x - 2} = \\dfrac{(x - 2)(x + 2)}{x - 2} = x + 2.',
  },
  {
    id: 5,
    prompt: 'Muốn cộng hai phân thức có mẫu thức khác nhau, ta làm thế nào?',
    latexExpression: '\\text{Quy tắc cộng khác mẫu}',
    options: ['Quy đồng mẫu thức rồi cộng các tử thức giữ nguyên mẫu chung', 'Cộng tử với tử và mẫu với mẫu', 'Nhân tử với tử và mẫu với mẫu', 'Rút gọn rồi cộng tử với tử'],
    correctIndex: 0,
    solution: 'Quy tắc: Quy đồng mẫu thức hai phân thức rồi thực hiện cộng các tử thức và giữ nguyên mẫu thức chung.',
  },
];

export default function CongTruPhanThucInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Phép cộng & Phép trừ Phân thức đại số</h4>
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
