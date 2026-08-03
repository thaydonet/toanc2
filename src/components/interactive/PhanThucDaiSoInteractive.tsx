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
    prompt: 'Phân thức đại số là một biểu thức có dạng A/B, trong đó A và B là những đa thức và B thỏa mãn điều kiện gì?',
    latexExpression: '\\dfrac{A}{B} \\quad (B = ?)',
    options: ['B khác đa thức 0', 'B là số tự nhiên khác 0', 'B là đơn thức bậc nhất', 'B bằng đa thức 0'],
    correctIndex: 0,
    solution: 'Định nghĩa: Phân thức đại số là biểu thức có dạng \\dfrac{A}{B}, trong đó A, B là những đa thức và B khác đa thức 0.',
  },
  {
    id: 2,
    prompt: 'Điều kiện xác định của phân thức \\dfrac{x + 3}{x - 2} là:',
    latexExpression: 'x - 2 \\neq 0 \\Rightarrow ?',
    options: ['x \\neq 2', 'x \\neq -3', 'x \\neq -2', 'x \\neq 0'],
    correctIndex: 0,
    solution: 'Phân thức xác định khi mẫu thức khác 0: x - 2 \\neq 0 \\Rightarrow x \\neq 2.',
  },
  {
    id: 3,
    prompt: 'Hai phân thức \\dfrac{A}{B} và \\dfrac{C}{D} bằng nhau khi và chỉ khi:',
    latexExpression: '\\dfrac{A}{B} = \\dfrac{C}{D} \\Leftrightarrow ?',
    options: ['A \\cdot D = B \\cdot C', 'A \\cdot C = B \\cdot D', 'A \\cdot B = C \\cdot D', 'A + D = B + C'],
    correctIndex: 0,
    solution: 'Quy tắc hai phân thức bằng nhau: \\dfrac{A}{B} = \\dfrac{C}{D} \\Leftrightarrow A \\cdot D = B \\cdot C.',
  },
  {
    id: 4,
    prompt: 'Giá trị của phân thức \\dfrac{x^2 - 1}{x + 1} tại x = 3 bằng bao nhiêu?',
    latexExpression: 'x = 3 \\Rightarrow \\dfrac{3^2 - 1}{3 + 1} = ?',
    options: ['2', '3', '4', '1'],
    correctIndex: 0,
    solution: 'Tại x = 3 (thỏa mãn mẫu x + 1 \\neq 0): \\dfrac{3^2 - 1}{3 + 1} = \\dfrac{8}{4} = 2.',
  },
  {
    id: 5,
    prompt: 'Biểu thức nào sau đây KHÔNG PHẢI là phân thức đại số?',
    latexExpression: '\\text{Nhận biết phân thức}',
    options: ['\\dfrac{x + 1}{0}', '\\dfrac{2x + 1}{x^2 + 1}', '\\dfrac{x}{3}', '5'],
    correctIndex: 0,
    solution: '\\dfrac{x + 1}{0} có mẫu thức là đa thức 0 nên không phải là phân thức đại số.',
  },
];

export default function PhanThucDaiSoInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Phân thức đại số & Điều kiện xác định</h4>
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
