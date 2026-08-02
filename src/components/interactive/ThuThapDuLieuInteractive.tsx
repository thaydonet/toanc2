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
    prompt: 'Dữ liệu nào sau đây thuộc loại Dữ liệu định lượng (số liệu)?',
    latexExpression: '\\text{Phân loại dữ liệu thống kê}',
    options: ['Chiều cao các học sinh lớp 8A (cm)', 'Màu sắc yêu thích của các bạn trong lớp', 'Tên các môn học phổ thông', 'Xếp loại học lực (Giỏi, Khá, Trung bình)'],
    correctIndex: 0,
    solution: 'Dữ liệu định lượng là dữ liệu biểu thị dưới dạng số (chiều cao, cân nặng, điểm số,...).',
  },
  {
    id: 2,
    prompt: 'Dữ liệu nào sau đây là Dữ liệu định tính không thể sắp thứ tự?',
    latexExpression: '\\text{Dữ liệu định tính}',
    options: ['Quốc tịch của các du khách quốc tế', 'Xếp loại thi đua (Tốt, Khá, Đạt)', 'Mức độ hài lòng (Rất thích, Thích, Không thích)', 'Kích cỡ áo (S, M, L, XL)'],
    correctIndex: 0,
    solution: 'Quốc tịch là dữ liệu định tính không thể sắp xếp theo một thứ tự lớn nhỏ hay thứ bậc.',
  },
  {
    id: 3,
    prompt: 'Phương pháp nào sau đây là Thu thập dữ liệu trực tiếp?',
    latexExpression: '\\text{Phương pháp thu thập dữ liệu}',
    options: ['Phỏng vấn trực tiếp hoặc Quan sát thực tế', 'Tìm kiếm thông tin trên sách báo, Internet', 'Trích xuất dữ liệu từ Tổng cục Thống kê', 'Đọc số liệu từ các công trình nghiên cứu cũ'],
    correctIndex: 0,
    solution: 'Thu thập trực tiếp bao gồm làm phiếu hỏi, phỏng vấn, thực nghiệm, quan sát thực tế.',
  },
  {
    id: 4,
    prompt: 'Trong các dãy dữ liệu sau, dãy nào chứa dữ liệu KHÔNG HỢP LÝ?',
    latexExpression: '\\text{Tính hợp lý của dữ liệu}',
    options: ['Điểm thi môn Toán: 8; 9; 12; 7.5', 'Tuổi của học sinh lớp 8: 13; 14; 14; 13', 'Chiều cao học sinh (m): 1.52; 1.60; 1.58', 'Số thành viên gia đình: 3; 4; 5; 2'],
    correctIndex: 0,
    solution: 'Điểm thi môn Toán chỉ nằm trong thang điểm từ 0 đến 10, nên giá trị 12 là không hợp lý.',
  },
  {
    id: 5,
    prompt: 'Cho các số liệu: Nhiệt độ trung bình các tháng tại Hà Nội. Đây là loại dữ liệu gì?',
    latexExpression: '\\text{Nhiệt độ (degrees C)}',
    options: ['Dữ liệu định lượng liên tục', 'Dữ liệu định tính có thể sắp thứ tự', 'Dữ liệu định tính không thể sắp thứ tự', 'Không phải là dữ liệu thống kê'],
    correctIndex: 0,
    solution: 'Nhiệt độ là số thực biểu thị số đo liên tục nên là dữ liệu định lượng.',
  },
];

export default function ThuThapDuLieuInteractive() {
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
        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.15rem' }}>🎯 Luyện tập Thu thập & Phân loại dữ liệu Thống kê</h4>
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
