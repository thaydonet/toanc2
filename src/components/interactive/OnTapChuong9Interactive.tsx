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
    prompt: 'Cho $\\Delta ABC \\sim \\Delta A\'B\'C\'$ theo tỉ số $k = 2$. Biết chu vi $\\Delta ABC = 20$ cm. Chu vi $\\Delta A\'B\'C\'$ bằng:',
    latexExpression: 'P_{A\'B\'C\'} = \\dfrac{P_{ABC}}{k} = ?',
    options: ['10\\text{ cm}', '40\\text{ cm}', '20\\text{ cm}', '5\\text{ cm}'],
    correctIndex: 0,
    solution: '$P_{A\'B\'C\'} = \\dfrac{20}{2} = 10$ cm.',
  },
  {
    id: 2,
    prompt: 'Cho $\\Delta ABC$ vuông tại $A$ đường cao $AH$ có $AB = 6$ cm, $BC = 10$ cm. Độ dài đoạn $BH$ bằng:',
    latexExpression: 'BH = \\dfrac{AB^2}{BC} = ?',
    options: ['3.6\\text{ cm}', '6.4\\text{ cm}', '4.8\\text{ cm}', '5\\text{ cm}'],
    correctIndex: 0,
    solution: '$AB^2 = BH \\cdot BC \\Rightarrow BH = \\dfrac{6^2}{10} = \\dfrac{36}{10} = 3.6$ cm.',
  },
  {
    id: 3,
    prompt: 'Cho $\\Delta ABC \\sim \\Delta DEF$ theo tỉ số $k = 4$. Tỉ số diện tích $\\dfrac{S_{ABC}}{S_{DEF}}$ bằng:',
    latexExpression: '\\dfrac{S_{ABC}}{S_{DEF}} = ?',
    options: ['16', '4', '2', '8'],
    correctIndex: 0,
    solution: 'Tỉ số diện tích $= k^2 = 4^2 = 16$.',
  },
  {
    id: 4,
    prompt: 'Một cái cây vuông góc với mặt đất có bóng dài $6$m. Cùng lúc đó một cọc cao $2$m có bóng dài $1.5$m. Chiều cao của cây là:',
    latexExpression: 'h = 2 \\cdot \\dfrac{6}{1.5} = ?',
    options: ['8\\text{ m}', '6\\text{ m}', '4.5\\text{ m}', '9\\text{ m}'],
    correctIndex: 0,
    solution: 'Tam giác vuông do cây và bóng tạo thành đồng dạng với tam giác cọc và bóng: $\\dfrac{h}{2} = \\dfrac{6}{1.5} = 4 \\Rightarrow h = 8$ m.',
  },
  {
    id: 5,
    prompt: 'Bộ ba số đo cạnh nào sau đây tạo thành một tam giác vuông?',
    latexExpression: 'a^2 + b^2 = c^2',
    options: ['(6, 8, 10)', '(5, 7, 9)', '(4, 6, 8)', '(3, 5, 7)'],
    correctIndex: 0,
    solution: 'Vì $6^2 + 8^2 = 36 + 64 = 100 = 10^2$ nên $(6, 8, 10)$ là tam giác vuông.',
  },
];

export default function OnTapChuong9Interactive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Thử thách tổng hợp Ôn tập Chương 9: Tam giác đồng dạng</h4>
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
