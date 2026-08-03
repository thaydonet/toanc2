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
    prompt: 'Gieo một con xúc xắc 6 mặt cân đối. Xác suất của biến cố "Xuất hiện mặt có số chấm lớn hơn 4" là:',
    latexExpression: 'A = \\{5; 6\\} \\Rightarrow P(A) = ?',
    options: ['\\dfrac{1}{3}', '\\dfrac{1}{6}', '\\dfrac{1}{2}', '\\dfrac{2}{3}'],
    correctIndex: 0,
    solution: 'Các kết quả thuận lợi là {5, 6} (2 kết quả). P(A) = 2 / 6 = 1/3.',
  },
  {
    id: 2,
    prompt: 'Chọn ngẫu nhiên 1 học sinh từ lớp có 20 nam và 25 nữ. Xác suất chọn được học sinh nữ là:',
    latexExpression: 'P(\\text{Nữ}) = \\dfrac{25}{45} = ?',
    options: ['\\dfrac{5}{9}', '\\dfrac{4}{9}', '\\dfrac{5}{4}', '\\dfrac{4}{5}'],
    correctIndex: 0,
    solution: 'Tổng sĩ số N = 20 + 25 = 45. Xác suất chọn nữ = 25 / 45 = 5/9.',
  },
  {
    id: 3,
    prompt: 'Tung đồng xu 200 lần thấy có 108 lần ngửa. Xác suất thực nghiệm của biến cố xuất hiện mặt Ngửa là:',
    latexExpression: 'P_{tn}(\\text{Ngửa}) = \\dfrac{108}{200} = ?',
    options: ['0.54', '0.46', '0.50', '54'],
    correctIndex: 0,
    solution: 'Xác suất thực nghiệm = 108 / 200 = 0.54 (54%).',
  },
  {
    id: 4,
    prompt: 'Trong hộp có 5 thẻ xanh, 3 thẻ đỏ, 2 thẻ vàng. Rút ngẫu nhiên 1 thẻ. Xác suất rút được thẻ KHÔNG PHẢI MÀU ĐỎ là:',
    latexExpression: 'P(\\text{Không đỏ}) = ?',
    options: ['\\dfrac{7}{10}', '\\dfrac{3}{10}', '\\dfrac{1}{2}', '\\dfrac{4}{5}'],
    correctIndex: 0,
    solution: 'Tổng số thẻ N = 10. Số thẻ không phải đỏ là 5 xanh + 2 vàng = 7. P = 7/10.',
  },
  {
    id: 5,
    prompt: 'Nếu thực hiện phép thử n lần rất lớn, tỉ số giữa số lần xuất hiện k của biến cố A và n sẽ xấp xỉ giá trị nào?',
    latexExpression: '\\dfrac{k}{n} \\approx ?',
    options: ['Xác suất lý thuyết P(A)', '1', '0', '0.5'],
    correctIndex: 0,
    solution: 'Khi n rất lớn, xác suất thực nghiệm k/n xấp xỉ xác suất lý thuyết P(A).',
  },
];

export default function OnTapChuong8Interactive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Thử thách tổng hợp Ôn tập Chương 8: Xác suất của biến cố</h4>
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
