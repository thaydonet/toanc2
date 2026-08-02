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
    prompt: 'Hình thoi là tứ giác có tính chất đặc trưng nào?',
    latexExpression: '\\text{Định nghĩa Hình Thoi}',
    options: ['4 cạnh bằng nhau', '4 góc vuông', '2 đường chéo bằng nhau', '2 cặp cạnh đối không song song'],
    correctIndex: 0,
    solution: 'Định nghĩa: Hình thoi là tứ giác có 4 cạnh bằng nhau.',
  },
  {
    id: 2,
    prompt: 'Trong hình thoi, hai đường chéo có tính chất đặc biệt gì?',
    latexExpression: 'AC \\perp BD \\text{ và là đường phân giác}',
    options: ['Vuông góc với nhau và là đường phân giác của các góc', 'Bằng nhau và vuông góc', 'Cắt nhau tại 1/3 mỗi đường', 'Song song với nhau'],
    correctIndex: 0,
    solution: 'Tính chất hình thoi: Hai đường chéo vuông góc với nhau và là các đường phân giác của các góc của hình thoi.',
  },
  {
    id: 3,
    prompt: 'Hình vuông vừa là hình gì vừa là hình gì?',
    latexExpression: '\\text{Hình vuông} = \\text{Hình chữ nhật} + \\text{Hình thoi}',
    options: ['Vừa là hình chữ nhật vừa là hình thoi', 'Vừa là hình bình hành vừa là hình thang cân', 'Vừa là hình tròn vừa là hình vuông', 'Vừa là tam giác đều vừa là hình chữ nhật'],
    correctIndex: 0,
    solution: 'Hình vuông vừa là hình chữ nhật (có 4 góc vuông) vừa là hình thoi (có 4 cạnh bằng nhau).',
  },
  {
    id: 4,
    prompt: 'Cho hình thoi ABCD có độ dài 2 đường chéo $AC = 6$ cm, $BD = 8$ cm. Diện tích hình thoi bằng bao nhiêu?',
    latexExpression: 'S = \\dfrac{1}{2} \\cdot d_1 \\cdot d_2',
    options: ['24\\text{ cm}^2', '48\\text{ cm}^2', '14\\text{ cm}^2', '12\\text{ cm}^2'],
    correctIndex: 0,
    solution: 'Diện tích hình thoi $S = \\dfrac{1}{2} \\cdot 6 \\cdot 8 = 24\\text{ cm}^2$.',
  },
  {
    id: 5,
    prompt: 'Hình chữ nhật có hai đường chéo vuông góc là hình gì?',
    latexExpression: '\\text{Hình chữ nhật } + AC \\perp BD \\Rightarrow ?',
    options: ['Hình vuông', 'Hình thoi', 'Hình bình hành', 'Hình thang cân'],
    correctIndex: 0,
    solution: 'Dấu hiệu nhận biết: Hình chữ nhật có hai đường chéo vuông góc là hình vuông.',
  },
];

export default function HinhThoiVuongInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Hình thoi & Hình vuông: Tính chất & Dấu hiệu nhận biết</h4>
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
