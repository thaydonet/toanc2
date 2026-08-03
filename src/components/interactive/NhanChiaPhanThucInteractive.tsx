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
    prompt: 'Thực hiện phép tính \\dfrac{x + 2}{x - 1} \\cdot \\dfrac{x - 1}{x + 2} được kết quả:',
    latexExpression: '\\dfrac{(x + 2)(x - 1)}{(x - 1)(x + 2)} = ?',
    options: ['1', '0', 'x + 2', 'x - 1'],
    correctIndex: 0,
    solution: '\\dfrac{(x + 2)(x - 1)}{(x - 1)(x + 2)} = 1.',
  },
  {
    id: 2,
    prompt: 'Phân thức nghịch đảo của phân thức \\dfrac{2x}{x - 3} là:',
    latexExpression: '\\text{Nghịch đảo của } \\dfrac{A}{B}',
    options: ['\\dfrac{x - 3}{2x}', '\\dfrac{-2x}{x - 3}', '\\dfrac{3 - x}{2x}', '\\dfrac{2x}{3 - x}'],
    correctIndex: 0,
    solution: 'Phân thức nghịch đảo của \\dfrac{A}{B} là \\dfrac{B}{A} (với A, B khác 0). Do đó nghịch đảo là \\dfrac{x - 3}{2x}.',
  },
  {
    id: 3,
    prompt: 'Thực hiện phép chia \\dfrac{x^2 - 4}{x + 1} : \\dfrac{x - 2}{x + 1} được kết quả:',
    latexExpression: '\\dfrac{(x - 2)(x + 2)}{x + 1} \\cdot \\dfrac{x + 1}{x - 2} = ?',
    options: ['x + 2', 'x - 2', '\\dfrac{1}{x + 2}', '1'],
    correctIndex: 0,
    solution: '\\dfrac{(x - 2)(x + 2)}{x + 1} \\cdot \\dfrac{x + 1}{x - 2} = x + 2.',
  },
  {
    id: 4,
    prompt: 'Muốn nhân hai phân thức \\dfrac{A}{B} và \\dfrac{C}{D}, ta làm thế nào?',
    latexExpression: '\\dfrac{A}{B} \\cdot \\dfrac{C}{D} = ?',
    options: ['\\dfrac{A \\cdot C}{B \\cdot D}', '\\dfrac{A \\cdot D}{B \\cdot C}', '\\dfrac{A + C}{B + D}', '\\dfrac{A - C}{B - D}'],
    correctIndex: 0,
    solution: 'Quy tắc nhân phân thức: Ta nhân các tử thức với nhau và các mẫu thức với nhau.',
  },
  {
    id: 5,
    prompt: 'Tính giá trị biểu thức P = \\dfrac{x}{x + 1} : \\dfrac{x}{x^2 - 1} tại x = 3:',
    latexExpression: 'x = 3 \\Rightarrow P = \\dfrac{x(x - 1)(x + 1)}{(x + 1)x} = ?',
    options: ['2', '3', '4', '1'],
    correctIndex: 0,
    solution: 'P = \\dfrac{x}{x + 1} \\cdot \\dfrac{(x - 1)(x + 1)}{x} = x - 1. Thay x = 3 \\Rightarrow P = 3 - 1 = 2.',
  },
];

export default function NhanChiaPhanThucInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Phép nhân & Phép chia Phân thức đại số</h4>
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
