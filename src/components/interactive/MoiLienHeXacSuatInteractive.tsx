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
    prompt: 'Xác suất thực nghiệm của một biến cố là gì?',
    latexExpression: 'P_{tn}(A) = \\dfrac{k}{n}',
    options: ['Tỉ số giữa số lần biến cố xuất hiện k và tổng số lần thực hiện n phép thử', 'Xác suất lý thuyết', 'Số ngẫu nhiên từ 0 đến 1', 'Số lần xuất hiện k'],
    correctIndex: 0,
    solution: 'Xác suất thực nghiệm P_tn(A) = k / n.',
  },
  {
    id: 2,
    prompt: 'Khi số lần lặp lại một phép thử ngẫu nhiên càng lớn thì xác suất thực nghiệm của biến cố sẽ như thế nào?',
    latexExpression: 'n \\rightarrow \\infty \\Rightarrow P_{tn}(A) \\rightarrow ?',
    options: ['Càng xấp xỉ sát với xác suất lý thuyết', 'Càng tiến dần về 0', 'Càng tiến dần về 100', 'Dao động ngày càng mạnh'],
    correctIndex: 0,
    solution: 'Luật số lớn: Khi n đủ lớn, xác suất thực nghiệm xấp xỉ sát với xác suất lý thuyết.',
  },
  {
    id: 3,
    prompt: 'Tung một đồng xu 100 lần thấy xuất hiện mặt Sấp 52 lần. Xác suất thực nghiệm của biến cố xuất hiện mặt Sấp là:',
    latexExpression: 'P_{tn}(\\text{Sấp}) = \\dfrac{52}{100} = ?',
    options: ['0.52', '0.48', '0.50', '52'],
    correctIndex: 0,
    solution: 'Xác suất thực nghiệm = 52 / 100 = 0.52 (hay 52%).',
  },
  {
    id: 4,
    prompt: 'Gieo một con xúc xắc 60 lần thấy xuất hiện mặt 6 chấm 9 lần. Xác suất thực nghiệm xuất hiện mặt 6 chấm là:',
    latexExpression: 'P_{tn}(6) = \\dfrac{9}{60} = ?',
    options: ['0.15', '0.10', '0.20', '0.12'],
    correctIndex: 0,
    solution: 'Xác suất thực nghiệm = 9 / 60 = 0.15 (hay 15%). Xác suất lý thuyết là 1/6 ~ 0.167.',
  },
  {
    id: 5,
    prompt: 'Trong thực tế, khi không thể tính toán được xác suất lý thuyết, người ta ước lượng xác suất lý thuyết bằng:',
    latexExpression: '\\text{Ước lượng xác suất}',
    options: ['Xác suất thực nghiệm thu được qua số lượng thử nghiệm đủ lớn', 'Đoán ngẫu nhiên', 'Lấy giá trị 0.5', 'Không thể ước lượng'],
    correctIndex: 0,
    solution: 'Người ta dùng xác suất thực nghiệm thu được từ một mẫu thử lớn để ước lượng xác suất lý thuyết.',
  },
];

export default function MoiLienHeXacSuatInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Mối liên hệ giữa Xác suất Thực nghiệm & Lý thuyết</h4>
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
