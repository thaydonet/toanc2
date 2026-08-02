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
    prompt: 'Cho tam giác ABC có AD là đường phân giác trong góc A ($D \\in BC$). Tỉ lệ thức nào sau đây ĐÚNG?',
    latexExpression: '\\dfrac{DB}{DC} = ?',
    options: ['\\dfrac{AB}{AC}', '\\dfrac{AC}{AB}', '\\dfrac{BC}{AB}', '\\dfrac{AD}{AC}'],
    correctIndex: 0,
    solution: 'Định lí tính chất đường phân giác: Trong tam giác, đường phân giác của một góc chia cạnh đối diện thành hai đoạn thẳng tương ứng tỉ lệ với hai cạnh kề hai đoạn ấy. Do đó \\dfrac{DB}{DC} = \\dfrac{AB}{AC}.',
  },
  {
    id: 2,
    prompt: 'Cho $\\triangle ABC$ có phân giác $AD$. Biết $AB = 6$ cm, $AC = 9$ cm, $DB = 4$ cm. Tính độ dài $DC$:',
    latexExpression: '\\dfrac{DB}{DC} = \\dfrac{AB}{AC} \\Rightarrow \\dfrac{4}{DC} = \\dfrac{6}{9}',
    options: ['6\\text{ cm}', '8\\text{ cm}', '5\\text{ cm}', '7\\text{ cm}'],
    correctIndex: 0,
    solution: '\\dfrac{4}{DC} = \\dfrac{6}{9} = \\dfrac{2}{3} \\Rightarrow DC = \\dfrac{4 \\cdot 3}{2} = 6\\text{ cm}.',
  },
  {
    id: 3,
    prompt: 'Cho $\\triangle ABC$ có phân giác $AD$. Biết $AB = 8$ cm, $AC = 12$ cm và $BC = 10$ cm. Tính độ dài $DB$:',
    latexExpression: 'DB + DC = 10 \\text{ và } \\dfrac{DB}{DC} = \\dfrac{8}{12}',
    options: ['4\\text{ cm}', '6\\text{ cm}', '5\\text{ cm}', '3\\text{ cm}'],
    correctIndex: 0,
    solution: '\\dfrac{DB}{DC} = \\dfrac{8}{12} = \\dfrac{2}{3} \\Rightarrow DB = \\dfrac{2}{2+3} \\cdot 10 = 4\\text{ cm}.',
  },
  {
    id: 4,
    prompt: 'Tính chất đường phân giác có đúng với đường phân giác góc ngoài của tam giác không?',
    latexExpression: '\\text{Phân giác góc ngoài}',
    options: ['Có đúng (với điều kiện hai cạnh kề không bằng nhau)', 'Không đúng', 'Chỉ đúng cho tam giác vuông', 'Chỉ đúng cho tam giác đều'],
    correctIndex: 0,
    solution: 'Tính chất đường phân giác vẫn hoàn toàn đúng đối với tia phân giác của góc ngoài tam giác (nếu $AB \\neq AC$).',
  },
  {
    id: 5,
    prompt: 'Cho $\\triangle ABC$ có $AB = 5$ cm, $AC = 5$ cm, đường phân giác $AD$. Khẳng định nào ĐÚNG?',
    latexExpression: 'DB \\text{ và } DC',
    options: ['DB = DC', 'DB = 2DC', 'DC = 2DB', 'DB > DC'],
    correctIndex: 0,
    solution: 'Vì $AB = AC = 5$ cm nên \\dfrac{DB}{DC} = \\dfrac{AB}{AC} = 1 \\Rightarrow DB = DC$. D là trung điểm của BC.',
  },
];

export default function PhanGiacTamGiacInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Tính chất Đường phân giác của Tam giác</h4>
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
