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
    prompt: 'Khẳng định nào sau đây SAI về mối quan hệ giữa các hình tứ giác?',
    latexExpression: '\\text{Mối quan hệ các loại tứ giác}',
    options: ['Mọi hình bình hành đều là hình chữ nhật', 'Hình vuông vừa là hình chữ nhật vừa là hình thoi', 'Mọi hình thang cân đều là hình thang', 'Hình chữ nhật có 2 cạnh kề bằng nhau là hình vuông'],
    correctIndex: 0,
    solution: 'Sai vì: Hình bình hành chỉ trở thành hình chữ nhật khi có 1 góc vuông hoặc 2 đường chéo bằng nhau. Không phải mọi hình bình hành đều là hình chữ nhật.',
  },
  {
    id: 2,
    prompt: 'Cho hình vuông ABCD có độ dài đường chéo $AC = 6\\sqrt{2}$ cm. Độ dài cạnh hình vuông bằng bao nhiêu?',
    latexExpression: 'AC = a\\sqrt{2}',
    options: ['6\\text{ cm}', '12\\text{ cm}', '3\\text{ cm}', '9\\text{ cm}'],
    correctIndex: 0,
    solution: 'Trong hình vuông cạnh a, đường chéo $AC = a\\sqrt{2} = 6\\sqrt{2} \\Rightarrow a = 6$ cm.',
  },
  {
    id: 3,
    prompt: 'Tứ giác có 2 đường chéo bằng nhau và cắt nhau tại trung điểm mỗi đường là hình gì?',
    latexExpression: 'AC = BD \\text{ và } O \\text{ là trung điểm}',
    options: ['Hình chữ nhật', 'Hình thoi', 'Hình bình hành', 'Hình thang cân'],
    correctIndex: 0,
    solution: 'Tứ giác có 2 đường chéo cắt nhau tại trung điểm mỗi đường là HBH; HBH có 2 đường chéo bằng nhau là hình chữ nhật.',
  },
  {
    id: 4,
    prompt: 'Cho hình thoi ABCD có $\\widehat{A} = 60^\\circ$. Tam giác ABD là tam giác gì?',
    latexExpression: 'AB = AD \\text{ và } \\widehat{A} = 60^\\circ',
    options: ['Tam giác đều', 'Tam giác vuông cân', 'Tam giác tù', 'Tam giác vuông'],
    correctIndex: 0,
    solution: 'Hình thoi có $AB = AD$, tam giác ABD cân tại A có góc $\\widehat{A} = 60^\\circ$ nên ABD là tam giác đều.',
  },
  {
    id: 5,
    prompt: 'Hình thang ABCD (AB // CD) có $\\widehat{A} = 100^\\circ, \\widehat{C} = 70^\\circ$. Tính góc $\\widehat{D}$ và $\\widehat{B}$:',
    latexExpression: '\\widehat{D} = ?, \\widehat{B} = ?',
    options: ['\\widehat{D} = 80^\\circ, \\widehat{B} = 110^\\circ', '\\widehat{D} = 100^\\circ, \\widehat{B} = 70^\\circ', '\\widehat{D} = 70^\\circ, \\widehat{B} = 100^\\circ', '\\widehat{D} = 110^\\circ, \\widehat{B} = 80^\\circ'],
    correctIndex: 0,
    solution: 'Hai góc kề một cạnh bên bù nhau: $\\widehat{D} = 180^\\circ - \\widehat{A} = 80^\\circ$; $\\widehat{B} = 180^\\circ - \\widehat{C} = 110^\\circ$.',
  },
];

export default function OnTapChuong3Interactive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Thử thách tổng hợp Ôn tập Chương 3: Các loại Tứ giác</h4>
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
