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
    prompt: 'Hình bình hành là tứ giác có hai cặp cạnh đối như thế nào?',
    latexExpression: '\\text{Định nghĩa hình bình hành}',
    options: ['Song song với nhau', 'Bằng nhau và vuông góc', 'Cắt nhau tại trung điểm', 'Bằng một nửa đường chéo'],
    correctIndex: 0,
    solution: 'Định nghĩa: Hình bình hành là tứ giác có các cạnh đối song song ($AB // CD, AD // BC$).',
  },
  {
    id: 2,
    prompt: 'Trong hình bình hành ABCD, giao điểm O của hai đường chéo AC và BD là:',
    latexExpression: 'O = AC \\cap BD',
    options: ['Trung điểm của mỗi đường chéo', 'Trọng tâm tứ giác', 'Trực tâm tứ giác', 'Điểm nằm ngoài hai đường chéo'],
    correctIndex: 0,
    solution: 'Tính chất: Hai đường chéo của hình bình hành cắt nhau tại trung điểm của mỗi đường.',
  },
  {
    id: 3,
    prompt: 'Cho hình bình hành ABCD có $\\widehat{A} = 110^\\circ$. Tính góc $\\widehat{C}$ và $\\widehat{B}$:',
    latexExpression: '\\widehat{A} = 110^\\circ \\Rightarrow \\widehat{C} = ?, \\widehat{B} = ?',
    options: ['\\widehat{C} = 110^\\circ, \\widehat{B} = 70^\\circ', '\\widehat{C} = 70^\\circ, \\widehat{B} = 110^\\circ', '\\widehat{C} = 110^\\circ, \\widehat{B} = 110^\\circ', '\\widehat{C} = 70^\\circ, \\widehat{B} = 70^\\circ'],
    correctIndex: 0,
    solution: 'Tính chất góc: Các góc đối bằng nhau (\\widehat{C} = \\widehat{A} = 110^\\circ), hai góc kề bù nhau (\\widehat{B} = 180^\\circ - 110^\\circ = 70^\\circ).',
  },
  {
    id: 4,
    prompt: 'Dấu hiệu nào sau đây KHÔNG ĐÚNG để chứng minh một tứ giác là hình bình hành?',
    latexExpression: '\\text{Dấu hiệu nhận biết HBH}',
    options: ['Tứ giác có hai đường chéo vuông góc', 'Tứ giác có các cạnh đối song song', 'Tứ giác có các cạnh đối bằng nhau', 'Tứ giác có hai cạnh đối song song và bằng nhau'],
    correctIndex: 0,
    solution: 'Hai đường chéo vuông góc là dấu hiệu của hình thoi, không phải hình bình hành tổng quát.',
  },
  {
    id: 5,
    prompt: 'Cho hình bình hành ABCD có $AB = 8$ cm, $BC = 5$ cm. Chu vi hình bình hành bằng bao nhiêu?',
    latexExpression: 'P = 2 \\cdot (AB + BC)',
    options: ['26\\text{ cm}', '13\\text{ cm}', '40\\text{ cm}', '20\\text{ cm}'],
    correctIndex: 0,
    solution: 'Chu vi hình bình hành: P = 2(8 + 5) = 2(13) = 26 cm.',
  },
];

export default function HinhBinhHanhInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Hình bình hành: Tính chất & Dấu hiệu nhận biết</h4>
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
