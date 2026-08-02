import React, { useState } from 'react';
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

interface ReviewProblem {
  title: string;
  question: string;
  latex: string;
  result: string;
  explanation: string;
}

const REVIEW_PROBLEMS: ReviewProblem[] = [
  {
    title: 'Đơn thức & Thu gọn',
    question: 'Thu gọn đơn thức $A = (-2x^2y^3) \\cdot (3x^3y)$ và tìm bậc:',
    latex: '(-2x^2y^3) \\cdot (3x^3y)',
    result: '-6x^5y^4 \\text{ (Bậc: 9)}',
    explanation: '(-2 \\cdot 3)(x^{2+3})(y^{3+1}) = -6x^5y^4. Bậc = 5 + 4 = 9.'
  },
  {
    title: 'Cộng / Trừ Đa thức',
    question: 'Tính $(5x^2y - 3xy^2) + (2x^2y + 4xy^2) - (3x^2y + xy^2)$:',
    latex: '(5x^2y - 3xy^2) + (2x^2y + 4xy^2) - (3x^2y + xy^2)',
    result: '4x^2y',
    explanation: '(5 + 2 - 3)x^2y + (-3 + 4 - 1)xy^2 = 4x^2y + 0 = 4x^2y.'
  },
  {
    title: 'Nhân Đa thức',
    question: 'Rút gọn biểu thức $P = (x - 2)(x + 2) - (x - 3)(x + 1)$:',
    latex: '(x - 2)(x + 2) - (x - 3)(x + 1)',
    result: '2x - 1',
    explanation: '(x^2 - 4) - (x^2 - 2x - 3) = x^2 - 4 - x^2 + 2x + 3 = 2x - 1.'
  },
  {
    title: 'Chia Đa thức cho Đơn thức',
    question: 'Thực hiện phép chia $(12x^4y^3 - 8x^3y^2 + 4x^2y^2) : 4x^2y^2$:',
    latex: '(12x^4y^3 - 8x^3y^2 + 4x^2y^2) : 4x^2y^2',
    result: '3x^2y - 2x + 1',
    explanation: 'Chia từng hạng tử cho 4x^2y^2 ta được 3x^2y - 2x + 1.'
  }
];

const getRandomReviewProblem = (): ReviewProblem => {
  return REVIEW_PROBLEMS[Math.floor(Math.random() * REVIEW_PROBLEMS.length)];
};

export default function OnTapChuong1Interactive() {
  const [prob, setProb] = useState<ReviewProblem>(getRandomReviewProblem);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const handleNext = () => {
    setShowSolution(false);
    let nextP = getRandomReviewProblem();
    while (nextP.latex === prob.latex && REVIEW_PROBLEMS.length > 1) {
      nextP = getRandomReviewProblem();
    }
    setProb(nextP);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      margin: '1.5rem 0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.25rem',
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '0.75rem'
      }}>
        <span style={{ fontSize: '1.5rem' }}>🏆</span>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Ôn tập Tổng hợp Chương 1 (Đa thức)
        </h3>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '2px solid #f59e0b',
        borderRadius: '16px',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#b45309', fontWeight: 700, marginBottom: '0.5rem' }}>
          📌 Dạng bài: {prob.title}
        </div>

        <div style={{ fontSize: '1.05rem', color: '#78350f', fontWeight: 600, marginBottom: '0.75rem' }}>
          {prob.question}
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '1.25rem 2rem',
          display: 'inline-block',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          margin: '0.5rem 0 1.25rem 0',
          fontSize: '1.6rem'
        }}>
          <KatexDisplay math={prob.latex} block={true} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          {!showSolution ? (
            <button
              onClick={() => setShowSolution(true)}
              style={{
                background: '#d97706',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(217, 119, 6, 0.2)'
              }}
            >
              👁️ Xem đáp số & Lời giải chi tiết
            </button>
          ) : (
            <div style={{
              marginTop: '1rem',
              padding: '1.25rem',
              borderRadius: '12px',
              background: '#ffffff',
              borderLeft: '5px solid #f59e0b',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#b45309', marginBottom: '0.5rem' }}>
                🎉 Kết quả: <KatexDisplay math={prob.result} />
              </div>
              <div style={{ color: '#334155', fontSize: '0.95rem' }}>
                <strong>Các bước giải:</strong> <KatexDisplay math={prob.explanation} />
              </div>
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <button
                  onClick={handleNext}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.6rem 1.25rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  🎲 Thử thử thách tiếp theo ➔
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
