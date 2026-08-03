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
    prompt: 'Ba trường hợp đồng dạng của hai tam giác thường là:',
    latexExpression: '\\text{Trường hợp đồng dạng}',
    options: ['c.c.c, c.g.c, g.g', 'c.g.c, g.c.g, c.c.c', 'g.c.g, g.g, c.c.c', 'c.c.c, c.g.c, ch-gn'],
    correctIndex: 0,
    solution: '3 trường hợp đồng dạng tam giác thường: Cạnh - Cạnh - Cạnh (c.c.c), Cạnh - Góc - Cạnh (c.g.c), Góc - Góc (g.g).',
  },
  {
    id: 2,
    prompt: 'Cho $\\Delta ABC$ và $\\Delta DEF$ có $\\widehat{A} = \\widehat{D} = 50^\\circ$, $\\dfrac{AB}{DE} = \\dfrac{AC}{DF} = 2$. Hai tam giác đồng dạng theo trường hợp nào?',
    latexExpression: '\\text{Trường hợp đồng dạng?}',
    options: ['c.g.c', 'c.c.c', 'g.g', 'g.c.g'],
    correctIndex: 0,
    solution: 'Hai cạnh tỉ lệ và góc kẹp giữa bằng nhau $\\Rightarrow \\Delta ABC \\sim \\Delta DEF$ (c.g.c).',
  },
  {
    id: 3,
    prompt: 'Cho $\\Delta ABC$ và $\\Delta MNP$ có $\\widehat{A} = \\widehat{M} = 70^\\circ$ và $\\widehat{B} = \\widehat{N} = 40^\\circ$. Hai tam giác đồng dạng theo trường hợp nào?',
    latexExpression: '\\text{Trường hợp đồng dạng?}',
    options: ['g.g', 'c.g.c', 'c.c.c', 'g.c.g'],
    correctIndex: 0,
    solution: 'Hai cặp góc tương ứng bằng nhau $\\Rightarrow \\Delta ABC \\sim \\Delta MNP$ (g.g).',
  },
  {
    id: 4,
    prompt: 'Cho $\\Delta ABC$ có $AB = 3, BC = 5, AC = 6$ và $\\Delta MNP$ có $MN = 6, NP = 10, MP = 12$. Tỉ số đồng dạng $k$ của $\\Delta ABC$ và $\\Delta MNP$ là:',
    latexExpression: 'k = \\dfrac{AB}{MN} = \\dfrac{3}{6} = ?',
    options: ['\\dfrac{1}{2}', '2', '\\dfrac{1}{3}', '3'],
    correctIndex: 0,
    solution: 'Tỉ số các cạnh tương ứng là $\\dfrac{3}{6} = \\dfrac{5}{10} = \\dfrac{6}{12} = \\dfrac{1}{2} \\Rightarrow \\Delta ABC \\sim \\Delta MNP$ (c.c.c) theo $k = \\dfrac{1}{2}$.',
  },
  {
    id: 5,
    prompt: 'Nếu $\\Delta ABC \\sim \\Delta A\'B\'C\'$ (c.c.c) thì điều kiện tỉ lệ cạnh nào sau đây ĐÚNG?',
    latexExpression: '\\dfrac{AB}{A\'B\'} = ?',
    options: ['\\dfrac{AB}{A\'B\'} = \\dfrac{BC}{B\'C\'} = \\dfrac{AC}{A\'C\'}', '\\dfrac{AB}{A\'C\'} = \\dfrac{BC}{A\'B\'}', '\\dfrac{AB}{B\'C\'} = \\dfrac{AC}{A\'B\'}', '\\dfrac{AB}{A\'B\'} = \\dfrac{BC}{A\'C\'}'],
    correctIndex: 0,
    solution: 'Tỉ lệ các cạnh tương ứng: $\\dfrac{AB}{A\'B\'} = \\dfrac{BC}{B\'C\'} = \\dfrac{AC}{A\'C\'}$.',
  },
];

export default function TruongHopDongDangInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Các trường hợp đồng dạng tam giác (c.c.c, c.g.c, g.g)</h4>
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
