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
    prompt: 'Tổng các góc của một tứ giác luôn bằng bao nhiêu độ?',
    latexExpression: '\\widehat{A} + \\widehat{B} + \\widehat{C} + \\widehat{D} = ?',
    options: ['360^\\circ', '180^\\circ', '540^\\circ', '720^\\circ'],
    correctIndex: 0,
    solution: 'Theo định lý tổng các góc trong một tứ giác: \\widehat{A} + \\widehat{B} + \\widehat{C} + \\widehat{D} = 360^\\circ',
  },
  {
    id: 2,
    prompt: 'Tứ giác ABCD có $\\widehat{A} = 80^\\circ, \\widehat{B} = 100^\\circ, \\widehat{C} = 110^\\circ$. Tính góc D:',
    latexExpression: '\\widehat{D} = 360^\\circ - (80^\\circ + 100^\\circ + 110^\\circ)',
    options: ['70^\\circ', '80^\\circ', '90^\\circ', '60^\\circ'],
    correctIndex: 0,
    solution: '\\widehat{D} = 360^\\circ - (80^\\circ + 100^\\circ + 110^\\circ) = 360^\\circ - 290^\\circ = 70^\\circ',
  },
  {
    id: 3,
    prompt: 'Tứ giác lồi là tứ giác như thế nào?',
    latexExpression: '\\text{Tứ giác lồi}',
    options: ['Luôn nằm trong một nửa mặt phẳng có bờ là đường thẳng chứa bất kỳ cạnh nào', 'Có 1 góc tù lớn hơn 180 độ', 'Có 2 cạnh cắt nhau', 'Có hai đường chéo vuông góc'],
    correctIndex: 0,
    solution: 'Định nghĩa: Tứ giác lồi là tứ giác luôn nằm trong một nửa mặt phẳng có bờ là đường thẳng chứa bất kỳ cạnh nào của tứ giác.',
  },
  {
    id: 4,
    prompt: 'Tứ giác ABCD có các góc tỉ lệ với 1 : 2 : 3 : 4. Tính góc lớn nhất của tứ giác:',
    latexExpression: '1x + 2x + 3x + 4x = 360^\\circ',
    options: ['144^\\circ', '108^\\circ', '120^\\circ', '150^\\circ'],
    correctIndex: 0,
    solution: '10x = 360^\\circ \\Rightarrow x = 36^\\circ. Góc lớn nhất là 4x = 4 \\cdot 36^\\circ = 144^\\circ.',
  },
  {
    id: 5,
    prompt: 'Cho tứ giác ABCD có góc ngoài tại đỉnh A bằng $110^\\circ$. Tính góc trong $\\widehat{A}$:',
    latexExpression: '\\widehat{A}_{trong} + \\widehat{A}_{ngoai} = 180^\\circ',
    options: ['70^\\circ', '110^\\circ', '80^\\circ', '90^\\circ'],
    correctIndex: 0,
    solution: '\\widehat{A}_{trong} = 180^\\circ - 110^\\circ = 70^\\circ.',
  },
];

export default function TuGiacInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Tứ giác & Tổng các góc trong tứ giác</h4>
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
