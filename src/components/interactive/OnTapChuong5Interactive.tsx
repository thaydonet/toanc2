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
    prompt: 'Trong một cuộc điều tra, dữ liệu thu được là danh sách các môn thể thao yêu thích: [Bóng đá, Cầu lông, Bóng rổ, Bơi lội]. Đây là loại dữ liệu gì?',
    latexExpression: '\\text{Môn thể thao yêu thích}',
    options: ['Dữ liệu định tính không thể sắp thứ tự', 'Dữ liệu định lượng rời rạc', 'Dữ liệu định tính có thể sắp thứ tự', 'Dữ liệu định lượng liên tục'],
    correctIndex: 0,
    solution: 'Môn thể thao là dữ liệu định tính (chữ) và không có thứ tự hơn kém.',
  },
  {
    id: 2,
    prompt: 'Một biểu đồ hình quạt tròn gồm 3 phần: phần A (50%), phần B (30%), phần C (20%). Số đo góc ở tâm biểu diễn phần B là:',
    latexExpression: '\\alpha_B = 30\\% \\cdot 360^\\circ',
    options: ['108^\\circ', '180^\\circ', '72^\\circ', '90^\\circ'],
    correctIndex: 0,
    solution: '\\alpha_B = 30\\% \\cdot 360^\\circ = 0.3 \\cdot 360^\\circ = 108^\\circ.',
  },
  {
    id: 3,
    prompt: 'Khi muốn so sánh tỉ lệ đóng góp của từng mặt hàng nông sản trong tổng kim ngạch xuất khẩu năm 2023, loại biểu đồ nào là lựa chọn tốt nhất?',
    latexExpression: '\\text{Tỉ lệ phần trăm các mặt hàng}',
    options: ['Biểu đồ hình quạt tròn', 'Biểu đồ đoạn thẳng', 'Biểu đồ hình tán xạ', 'Biểu đồ cột đôi'],
    correctIndex: 0,
    solution: 'Biểu đồ hình quạt tròn giúp so sánh cơ cấu tỉ lệ % của các thành phần trong toàn thể 100%.',
  },
  {
    id: 4,
    prompt: 'Một khảo sát 200 khách hàng: 80 chọn Thương hiệu A, 70 chọn Thương hiệu B, còn lại chọn Thương hiệu C. Tỉ lệ % khách chọn Thương hiệu C là:',
    latexExpression: '\\%C = \\dfrac{200 - (80 + 70)}{200} \\cdot 100\\%',
    options: ['25\\%', '40\\%', '35\\%', '30\\%'],
    correctIndex: 0,
    solution: 'Số khách chọn C $= 200 - 150 = 50$ người. Tỉ lệ $= \\dfrac{50}{200} \\cdot 100\\% = 25\\%$.',
  },
  {
    id: 5,
    prompt: 'Khi phân tích một dãy dữ liệu điểm thi học sinh giỏi, điểm 10 xuất hiện nhiều nhất. Điểm 10 được gọi là gì trong thống kê?',
    latexExpression: '\\text{Giá trị có tần số lớn nhất}',
    options: ['Mốt (Mode) của dãy dữ liệu', 'Số trung bình cộng', 'Trung vị', 'Độ lệch chuẩn'],
    correctIndex: 0,
    solution: 'Giá trị có tần số xuất hiện nhiều nhất trong dãy số liệu được gọi là Mốt (Mode).',
  },
];

export default function OnTapChuong5Interactive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Thử thách tổng hợp Ôn tập Chương 5: Dữ liệu & Biểu diễn dữ liệu</h4>
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
