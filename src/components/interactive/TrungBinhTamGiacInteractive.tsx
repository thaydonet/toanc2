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
    prompt: 'Đường trung bình của tam giác là đoạn thẳng nối:',
    latexExpression: '\\text{Định nghĩa đường trung bình}',
    options: ['Trung điểm hai cạnh của tam giác', 'Một đỉnh với trung điểm cạnh đối diện', 'Một đỉnh với chân đường cao', 'Hai đỉnh của tam giác'],
    correctIndex: 0,
    solution: 'Định nghĩa: Đường trung bình của tam giác là đoạn thẳng nối trung điểm hai cạnh của tam giác.',
  },
  {
    id: 2,
    prompt: 'Trong tam giác ABC, MN là đường trung bình nối trung điểm AB và AC. Khẳng định nào sau đây ĐÚNG?',
    latexExpression: 'MN = ? \\text{ và } MN // ?',
    options: ['MN // BC \\text{ và } MN = \\dfrac{1}{2}BC', 'MN \\perp BC \\text{ và } MN = BC', 'MN // BC \\text{ và } MN = BC', 'MN = \\dfrac{1}{3}BC'],
    correctIndex: 0,
    solution: 'Tính chất: Đường trung bình của tam giác thì song song với cạnh thứ ba và bằng một nửa cạnh đó.',
  },
  {
    id: 3,
    prompt: 'Cho $\\triangle ABC$ có $BC = 14$ cm. Gọi M, N lần lượt là trung điểm của AB và AC. Độ dài đoạn MN bằng bao nhiêu?',
    latexExpression: 'MN = \\dfrac{BC}{2}',
    options: ['7\\text{ cm}', '14\\text{ cm}', '28\\text{ cm}', '3.5\\text{ cm}'],
    correctIndex: 0,
    solution: '$MN = \\dfrac{BC}{2} = \\dfrac{14}{2} = 7\\text{ cm}$.',
  },
  {
    id: 4,
    prompt: 'Một tam giác có mấy đường trung bình?',
    latexExpression: '\\text{Số lượng đường trung bình}',
    options: ['3 đường trung bình', '2 đường trung bình', '1 đường trung bình', '4 đường trung bình'],
    correctIndex: 0,
    solution: 'Mỗi tam giác có 3 đường trung bình tương ứng nối trung điểm 3 cặp cạnh.',
  },
  {
    id: 5,
    prompt: 'Cho $\\triangle ABC$ có chu vi bằng 24 cm. Chu vi của tam giác tạo bởi 3 đường trung bình của $\\triangle ABC$ bằng bao nhiêu?',
    latexExpression: 'P_{trung\\_binh} = \\dfrac{1}{2} P_{ABC}',
    options: ['12\\text{ cm}', '6\\text{ cm}', '24\\text{ cm}', '18\\text{ cm}'],
    correctIndex: 0,
    solution: 'Chu vi tam giác trung bình bằng một nửa chu vi tam giác ban đầu $= \\dfrac{24}{2} = 12\\text{ cm}$.',
  },
];

export default function TrungBinhTamGiacInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Đường trung bình của Tam giác</h4>
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
