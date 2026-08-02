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
    prompt: 'Cho tam giác ABC có DE // BC (D trên AB, E trên AC). Tỉ số nào sau đây ĐÚNG theo định lí Thales?',
    latexExpression: '\\dfrac{AD}{AB} = ?',
    options: ['\\dfrac{AE}{AC}', '\\dfrac{AE}{EC}', '\\dfrac{EC}{AC}', '\\dfrac{AB}{AC}'],
    correctIndex: 0,
    solution: 'Định lí Thales: Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ. Do đó \\dfrac{AD}{AB} = \\dfrac{AE}{AC}.',
  },
  {
    id: 2,
    prompt: 'Cho $\\triangle ABC$ có $MN // BC$ ($M \\in AB, N \\in AC$). Biết $AM = 4$ cm, $MB = 2$ cm, $AN = 6$ cm. Tính độ dài $NC$:',
    latexExpression: '\\dfrac{AM}{MB} = \\dfrac{AN}{NC} \\Rightarrow \\dfrac{4}{2} = \\dfrac{6}{NC}',
    options: ['3\\text{ cm}', '4\\text{ cm}', '2\\text{ cm}', '5\\text{ cm}'],
    correctIndex: 0,
    solution: '\\dfrac{4}{2} = \\dfrac{6}{NC} \\Rightarrow 2 = \\dfrac{6}{NC} \\Rightarrow NC = 3\\text{ cm}.',
  },
  {
    id: 3,
    prompt: 'Cho $\\triangle ABC$ có $DE // BC$. Biết $AD = 3$ cm, $DB = 5$ cm, $DE = 4.5$ cm. Độ dài $BC$ bằng bao nhiêu?',
    latexExpression: '\\dfrac{DE}{BC} = \\dfrac{AD}{AB}',
    options: ['12\\text{ cm}', '9\\text{ cm}', '15\\text{ cm}', '10\\text{ cm}'],
    correctIndex: 0,
    solution: '$AB = AD + DB = 3 + 5 = 8$ cm. Theo hệ quả định lí Thales: \\dfrac{DE}{BC} = \\dfrac{AD}{AB} \\Rightarrow \\dfrac{4.5}{BC} = \\dfrac{3}{8} \\Rightarrow BC = \\dfrac{4.5 \\cdot 8}{3} = 12\\text{ cm}.',
  },
  {
    id: 4,
    prompt: 'Định lí Thales đảo dùng để làm gì?',
    latexExpression: '\\text{Ứng dụng định lí Thales đảo}',
    options: ['Chứng minh hai đường thẳng song song', 'Chứng minh hai đường thẳng vuông góc', 'Tính diện tích tam giác', 'Chứng minh tam giác bằng nhau'],
    correctIndex: 0,
    solution: 'Định lí Thales đảo là phương pháp quan trọng hàng đầu để chứng minh hai đường thẳng song song.',
  },
  {
    id: 5,
    prompt: 'Cho đoạn thẳng AB = 10 cm, CD = 15 cm. Tỉ số của hai đoạn thẳng AB và CD là:',
    latexExpression: '\\dfrac{AB}{CD} = ?',
    options: ['\\dfrac{2}{3}', '\\dfrac{3}{2}', '\\dfrac{1}{2}', '\\dfrac{4}{5}'],
    correctIndex: 0,
    solution: '\\dfrac{AB}{CD} = \\dfrac{10}{15} = \\dfrac{2}{3}.',
  },
];

export default function ThalesInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Định lí Thales: Thuận, Đảo & Hệ quả</h4>
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
