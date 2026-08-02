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

interface PolyOpProblem {
  polyA: string;
  polyB: string;
  op: '+' | '-';
  correctResult: string;
  explanation: string;
}

const OP_PROBLEMS: PolyOpProblem[] = [
  {
    polyA: '3x^2 + 2x - 1',
    polyB: 'x^2 - 5x + 4',
    op: '+',
    correctResult: '4x^2 - 3x + 3',
    explanation: '(3x^2 + 2x - 1) + (x^2 - 5x + 4) = (3+1)x^2 + (2-5)x + (-1+4) = 4x^2 - 3x + 3.'
  },
  {
    polyA: '3x^2 + 2x - 1',
    polyB: 'x^2 - 5x + 4',
    op: '-',
    correctResult: '2x^2 + 7x - 5',
    explanation: '(3x^2 + 2x - 1) - (x^2 - 5x + 4) = (3-1)x^2 + (2+5)x + (-1-4) = 2x^2 + 7x - 5.'
  },
  {
    polyA: '5x^2y - 3xy^2',
    polyB: '2x^2y + 4xy^2',
    op: '+',
    correctResult: '7x^2y + xy^2',
    explanation: '(5x^2y - 3xy^2) + (2x^2y + 4xy^2) = (5+2)x^2y + (-3+4)xy^2 = 7x^2y + xy^2.'
  },
  {
    polyA: '5x^2y - 3xy^2',
    polyB: '2x^2y + 4xy^2',
    op: '-',
    correctResult: '3x^2y - 7xy^2',
    explanation: '(5x^2y - 3xy^2) - (2x^2y + 4xy^2) = (5-2)x^2y + (-3-4)xy^2 = 3x^2y - 7xy^2.'
  },
  {
    polyA: '2x^3 - x + 5',
    polyB: 'x^3 + 3x^2 - 2',
    op: '+',
    correctResult: '3x^3 + 3x^2 - x + 3',
    explanation: '(2x^3 - x + 5) + (x^3 + 3x^2 - 2) = 3x^3 + 3x^2 - x + 3.'
  }
];

const getRandomOpProblem = (): PolyOpProblem => {
  return OP_PROBLEMS[Math.floor(Math.random() * OP_PROBLEMS.length)];
};

export default function CongTruDaThucInteractive() {
  const [prob, setProb] = useState<PolyOpProblem>(getRandomOpProblem);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleNext = () => {
    setShowSolution(false);
    let nextP = getRandomOpProblem();
    while (nextP.polyA === prob.polyA && nextP.op === prob.op && OP_PROBLEMS.length > 1) {
      nextP = getRandomOpProblem();
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
        <span style={{ fontSize: '1.5rem' }}>➕➖</span>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Phép cộng và Phép trừ Đa thức
        </h3>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '2px solid #86efac',
        borderRadius: '16px',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 700, marginBottom: '0.75rem' }}>
          🧮 Thực hiện phép tính:
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
          <KatexDisplay math={`(${prob.polyA}) ${prob.op} (${prob.polyB})`} block={true} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          {!showSolution ? (
            <button
              onClick={() => { setShowSolution(true); setScore(s => s + 1); }}
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)'
              }}
            >
              👁️ Xem kết quả & Lời giải chi tiết
            </button>
          ) : (
            <div style={{
              marginTop: '1rem',
              padding: '1.25rem',
              borderRadius: '12px',
              background: '#ffffff',
              borderLeft: '5px solid #22c55e',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#15803d', marginBottom: '0.5rem' }}>
                🎉 Kết quả: <KatexDisplay math={prob.correctResult} />
              </div>
              <div style={{ color: '#334155', fontSize: '0.95rem' }}>
                <strong>Các bước giải chi tiết:</strong> <KatexDisplay math={prob.explanation} />
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
                  🎲 Đổi bài tập ngẫu nhiên ➔
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
