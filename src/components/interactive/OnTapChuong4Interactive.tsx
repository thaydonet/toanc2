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
    prompt: 'Cho $\\triangle ABC$ có $DE // BC$ ($D \\in AB, E \\in AC$). Biết $AD = 3$ cm, $AB = 9$ cm, $AE = 4$ cm. Độ dài $AC$ bằng:',
    latexExpression: '\\dfrac{AD}{AB} = \\dfrac{AE}{AC}',
    options: ['12\\text{ cm}', '10\\text{ cm}', '8\\text{ cm}', '15\\text{ cm}'],
    correctIndex: 0,
    solution: '\\dfrac{3}{9} = \\dfrac{4}{AC} \\Rightarrow \\dfrac{1}{3} = \\dfrac{4}{AC} \\Rightarrow AC = 12\\text{ cm}.',
  },
  {
    id: 2,
    prompt: 'Cho tam giác ABC có M là trung điểm AB, N là trung điểm AC. Phát biểu nào sau đây SAI?',
    latexExpression: '\\text{Đường trung bình MN}',
    options: ['MN = BC', 'MN // BC', 'MN = \\dfrac{1}{2}BC', 'S_{AMN} = \\dfrac{1}{4}S_{ABC}'],
    correctIndex: 0,
    solution: 'Sai ở câu A vì $MN = \\dfrac{1}{2}BC$, không thể bằng $BC$.',
  },
  {
    id: 3,
    prompt: 'Cho $\\triangle ABC$ có $AB = 8$ cm, $AC = 12$ cm, phân giác $AD$ ($D \\in BC$). Tỉ số $\\dfrac{DB}{DC}$ bằng:',
    latexExpression: '\\dfrac{DB}{DC} = \\dfrac{AB}{AC}',
    options: ['\\dfrac{2}{3}', '\\dfrac{3}{2}', '\\dfrac{4}{5}', '\\dfrac{1}{2}'],
    correctIndex: 0,
    solution: '\\dfrac{DB}{DC} = \\dfrac{8}{12} = \\dfrac{2}{3}.',
  },
  {
    id: 4,
    prompt: 'Ba đường trung bình của tam giác chia tam giác đó thành mấy tam giác bằng nhau?',
    latexExpression: '\\text{Tam giác trung bình chia tam giác ban đầu}',
    options: ['4 tam giác bằng nhau', '3 tam giác bằng nhau', '2 tam giác bằng nhau', '6 tam giác bằng nhau'],
    correctIndex: 0,
    solution: 'Ba đường trung bình chia tam giác ban đầu thành 4 tam giác nhỏ bằng nhau (bằng nhau theo trường hợp c-c-c).',
  },
  {
    id: 5,
    prompt: 'Cho hình thang ABCD (AB // CD) có M là trung điểm AD, N là trung điểm BC. Biết AB = 6 cm, CD = 10 cm. Độ dài MN bằng:',
    latexExpression: 'MN = \\dfrac{AB + CD}{2}',
    options: ['8\\text{ cm}', '16\\text{ cm}', '7\\text{ cm}', '9\\text{ cm}'],
    correctIndex: 0,
    solution: 'Đường trung bình hình thang $MN = \\dfrac{AB + CD}{2} = \\dfrac{6 + 10}{2} = 8\\text{ cm}$.',
  },
];

export default function OnTapChuong4Interactive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Thử thách tổng hợp Ôn tập Chương 4: Định lí Thales</h4>
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
