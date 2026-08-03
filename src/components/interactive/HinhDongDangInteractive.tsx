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
    prompt: 'Khẳng định nào sau đây về hai hình đồng dạng là ĐÚNG?',
    latexExpression: '\\text{Khái niệm hình đồng dạng}',
    options: ['Có cùng hình dạng nhưng kích thước có thể khác nhau', 'Phải có cùng kích thước', 'Phải có cùng diện tích', 'Phải có cùng chu vi'],
    correctIndex: 0,
    solution: 'Hai hình đồng dạng có cùng hình dạng nhưng kích thước có thể phóng to hoặc thu nhỏ theo một tỉ lệ k.',
  },
  {
    id: 2,
    prompt: 'Mọi hình tròn trong mặt phẳng có tính chất gì?',
    latexExpression: '\\text{Hình tròn}',
    options: ['Luôn đồng dạng với nhau', 'Chỉ đồng dạng khi cùng bán kính', 'Không đồng dạng', 'Đồng dạng với hình vuông'],
    correctIndex: 0,
    solution: 'Tất cả các hình tròn luôn luôn đồng dạng với nhau.',
  },
  {
    id: 3,
    prompt: 'Khẳng định nào sau đây ĐÚNG về hai đa giác đều cùng số cạnh (ví dụ: hai hình vuông bất kỳ)?',
    latexExpression: '\\text{Đa giác đều n cạnh}',
    options: ['Luôn luôn đồng dạng với nhau', 'Chỉ đồng dạng khi có diện tích bằng nhau', 'Chỉ đồng dạng khi có chu vi bằng nhau', 'Không đồng dạng'],
    correctIndex: 0,
    solution: 'Hai đa giác đều có cùng số cạnh (như 2 hình vuông, 2 tam giác đều) luôn luôn đồng dạng.',
  },
  {
    id: 4,
    prompt: 'Hình đồng dạng phối cảnh (hình vị tự) là trường hợp đặc biệt của hai hình đồng dạng khi:',
    latexExpression: '\\text{Phối cảnh tâm O}',
    options: ['Các đường thẳng nối các cặp điểm tương ứng cùng đi qua một điểm tâm O', 'Diện tích bằng nhau', 'Không có điểm chung nào', 'Chu vi bằng nhau'],
    correctIndex: 0,
    solution: 'Hai hình đồng dạng phối cảnh có các đường thẳng nối từng cặp điểm tương ứng cùng đồng quy tại một điểm O (gọi là tâm phối cảnh).',
  },
  {
    id: 5,
    prompt: 'Cho hình vuông $ABCD$ có cạnh $4$ cm và hình vuông $A\'B\'C\'D\'$ có cạnh $8$ cm. Tỉ số đồng dạng của hai hình vuông là:',
    latexExpression: 'k = \\dfrac{A\'B\'}{AB} = ?',
    options: ['2', '\\dfrac{1}{2}', '4', '1'],
    correctIndex: 0,
    solution: '$k = \\dfrac{8}{4} = 2$.',
  },
];

export default function HinhDongDangInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Khái niệm Hình đồng dạng & Phối cảnh</h4>
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
