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
    prompt: 'Hai tam giác vuông đồng dạng khi thỏa mãn điều kiện nào sau đây?',
    latexExpression: '\\text{Điều kiện đồng dạng tam giác vuông}',
    options: ['Có một góc nhọn bằng nhau hoặc hai cạnh góc vuông tỉ lệ', 'Chỉ khi hai cạnh huyền bằng nhau', 'Có hai góc vuông bằng nhau', 'Có ba cạnh bằng nhau'],
    correctIndex: 0,
    solution: 'Hai tam giác vuông đồng dạng khi: (1) Có 1 góc nhọn bằng nhau, (2) 2 cạnh góc vuông tỉ lệ, (3) Cạnh huyền và 1 cạnh góc vuông tỉ lệ.',
  },
  {
    id: 2,
    prompt: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Khẳng định nào sau đây ĐÚNG?',
    latexExpression: '\\Delta HBA \\sim \\Delta HAC \\sim \\Delta ABC',
    options: ['\\Delta HBA \\sim \\Delta HAC', '\\Delta HBA \\sim \\Delta ABC', '\\Delta HAC \\sim \\Delta ABC', 'Cả 3 khẳng định trên đều đúng'],
    correctIndex: 3,
    solution: 'Đường cao hạ từ đỉnh góc vuông chia tam giác vuông thành 2 tam giác vuông đồng dạng với nhau và đồng dạng với tam giác ban đầu.',
  },
  {
    id: 3,
    prompt: 'Cho $\\Delta ABC$ vuông tại $A$ có $AH \\perp BC$. Công thức hệ thức lượng nào sau đây ĐÚNG?',
    latexExpression: 'AH^2 = ?',
    options: ['AH^2 = HB \\cdot HC', 'AH^2 = AB \\cdot AC', 'AH^2 = BC \\cdot HB', 'AH^2 = AB^2 + AC^2'],
    correctIndex: 0,
    solution: 'Vì $\\Delta HBA \\sim \\Delta HAC \\Rightarrow \\dfrac{AH}{HC} = \\dfrac{HB}{AH} \\Rightarrow AH^2 = HB \\cdot HC$.',
  },
  {
    id: 4,
    prompt: 'Cho $\\Delta ABC$ vuông tại $A$ đường cao $AH$ có $HB = 4$ cm, $HC = 9$ cm. Độ dài đường cao $AH$ là:',
    latexExpression: 'AH = \\sqrt{HB \\cdot HC} = ?',
    options: ['6\\text{ cm}', '13\\text{ cm}', '36\\text{ cm}', '5\\text{ cm}'],
    correctIndex: 0,
    solution: '$AH = \\sqrt{4 \\cdot 9} = \\sqrt{36} = 6$ cm.',
  },
  {
    id: 5,
    prompt: 'Hai tam giác vuông $\\Delta ABC$ (vuông tại A) và $\\Delta A\'B\'C\'$ (vuông tại A\') đồng dạng theo trường hợp Cạnh huyền - Cạnh góc vuông khi:',
    latexExpression: '\\dfrac{BC}{B\'C\'} = \\dfrac{AB}{A\'B\'}',
    options: ['\\dfrac{BC}{B\'C\'} = \\dfrac{AB}{A\'B\'}', '\\dfrac{AB}{A\'B\'} = \\dfrac{AC}{B\'C\'}', '\\dfrac{BC}{A\'B\'} = \\dfrac{AB}{B\'C\'}', '\\widehat{B} + \\widehat{C} = 90^\\circ'],
    correctIndex: 0,
    solution: 'Trường hợp Cạnh huyền - Cạnh góc vuông: Tỉ số cạnh huyền bằng tỉ số một cặp cạnh góc vuông.',
  },
];

export default function TamGiacVuongDongDangInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Tam giác vuông đồng dạng</h4>
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
