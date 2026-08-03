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
    prompt: 'Một hình chữ nhật có chu vi 36m. Chiều dài hơn chiều rộng 4m. Gọi chiều rộng là x (m), phương trình lập được là:',
    latexExpression: 'x + (x + 4) = 18 \\Rightarrow ?',
    options: ['x = 7', 'x = 8', 'x = 6', 'x = 10'],
    correctIndex: 0,
    solution: 'Nửa chu vi = 18m. Chiều dài x + 4. Phương trình x + x + 4 = 18 \\Rightarrow 2x = 14 \\Rightarrow x = 7m.',
  },
  {
    id: 2,
    prompt: 'Một người đi xe máy từ A đến B với vận tốc 40 km/h. Lượt về đi với vận tốc 50 km/h nên thời gian về ít hơn thời gian đi 30 phút (0.5h). Độ dài AB là:',
    latexExpression: '\\dfrac{S}{40} - \\dfrac{S}{50} = 0.5 \\Rightarrow S = ?',
    options: ['100 \\text{ km}', '80 \\text{ km}', '120 \\text{ km}', '90 \\text{ km}'],
    correctIndex: 0,
    solution: '\\dfrac{S}{40} - \\dfrac{S}{50} = 0.5 \\Rightarrow \\dfrac{S}{200} = 0.5 \\Rightarrow S = 100 \\text{ km}.',
  },
  {
    id: 3,
    prompt: 'Tổng hai số bằng 45. Số lớn gấp 4 lần số nhỏ. Số nhỏ là:',
    latexExpression: 'x + 4x = 45 \\Rightarrow ?',
    options: ['9', '36', '10', '8'],
    correctIndex: 0,
    solution: '5x = 45 \\Rightarrow x = 9.',
  },
  {
    id: 4,
    prompt: 'Hiện nay tuổi cha gấp 4 lần tuổi con. Sau 5 năm nữa, tuổi cha gấp 3 lần tuổi con. Tuổi con hiện nay là:',
    latexExpression: '4x + 5 = 3(x + 5) \\Rightarrow ?',
    options: ['10 \\text{ tuổi}', '12 \\text{ tuổi}', '8 \\text{ tuổi}', '15 \\text{ tuổi}'],
    correctIndex: 0,
    solution: '4x + 5 = 3x + 15 \\Rightarrow x = 10 \\text{ tuổi}.',
  },
  {
    id: 5,
    prompt: 'Các bước giải bài toán bằng cách lập phương trình gồm mấy bước chính?',
    latexExpression: '\\text{Quy trình giải bài toán lập PT}',
    options: ['3 bước (Lập PT, Giải PT, Trả lời kiểm tra ĐK)', '2 bước', '4 bước', '5 bước'],
    correctIndex: 0,
    solution: '3 bước chính: 1. Lập phương trình; 2. Giải phương trình; 3. Trả lời và đối chiếu điều kiện.',
  },
];

export default function GiaiToanLapPTInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Giải bài toán bằng cách lập phương trình</h4>
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
