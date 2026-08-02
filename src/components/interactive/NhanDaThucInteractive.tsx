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

interface MultProblem {
  expr: string;
  expanded: string;
  explanation: string;
}

const MULT_PROBLEMS: MultProblem[] = [
  {
    expr: '2x \\cdot (3x + 4)',
    expanded: '6x^2 + 8x',
    explanation: '2x \\cdot (3x + 4) = 2x \\cdot 3x + 2x \\cdot 4 = 6x^2 + 8x.'
  },
  {
    expr: '-3x^2 \\cdot (x - 2y)',
    expanded: '-3x^3 + 6x^2y',
    explanation: '-3x^2 \\cdot (x - 2y) = (-3x^2 \\cdot x) + (-3x^2 \\cdot (-2y)) = -3x^3 + 6x^2y.'
  },
  {
    expr: '(x + 2)(x + 3)',
    expanded: 'x^2 + 5x + 6',
    explanation: '(x + 2)(x + 3) = x^2 + 3x + 2x + 6 = x^2 + 5x + 6.'
  },
  {
    expr: '(x - 1)(2x + 5)',
    expanded: '2x^2 + 3x - 5',
    explanation: '(x - 1)(2x + 5) = 2x^2 + 5x - 2x - 5 = 2x^2 + 3x - 5.'
  },
  {
    expr: '(2x - y)(x + 3y)',
    expanded: '2x^2 + 5xy - 3y^2',
    explanation: '(2x - y)(x + 3y) = 2x^2 + 6xy - xy - 3y^2 = 2x^2 + 5xy - 3y^2.'
  }
];

const getRandomMultProblem = (): MultProblem => {
  return MULT_PROBLEMS[Math.floor(Math.random() * MULT_PROBLEMS.length)];
};

export default function NhanDaThucInteractive() {
  const [prob, setProb] = useState<MultProblem>(getRandomMultProblem);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const handleNext = () => {
    setShowSolution(false);
    let nextP = getRandomMultProblem();
    while (nextP.expr === prob.expr && MULT_PROBLEMS.length > 1) {
      nextP = getRandomMultProblem();
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
        <span style={{ fontSize: '1.5rem' }}>✖️</span>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Phép nhân Đa thức
        </h3>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
        border: '2px solid #fed7aa',
        borderRadius: '16px',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#c2410c', fontWeight: 700, marginBottom: '0.75rem' }}>
          ✖️ Nhân đa thức ngẫu nhiên:
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
          <KatexDisplay math={prob.expr} block={true} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          {!showSolution ? (
            <button
              onClick={() => setShowSolution(true)}
              style={{
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(234, 88, 12, 0.2)'
              }}
            >
              👁️ Xem khai triển & Rút gọn
            </button>
          ) : (
            <div style={{
              marginTop: '1rem',
              padding: '1.25rem',
              borderRadius: '12px',
              background: '#ffffff',
              borderLeft: '5px solid #f97316',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c2410c', marginBottom: '0.5rem' }}>
                🎉 Kết quả thu gọn: <KatexDisplay math={prob.expanded} />
              </div>
              <div style={{ color: '#334155', fontSize: '0.95rem' }}>
                <strong>Phân tích bước nhân:</strong> <KatexDisplay math={prob.explanation} />
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
