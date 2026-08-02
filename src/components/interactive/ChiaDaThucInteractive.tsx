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

interface DivProblem {
  poly: string;
  mono: string;
  result: string;
  explanation: string;
}

const DIV_PROBLEMS: DivProblem[] = [
  {
    poly: '6x^3 - 9x^2 + 12x',
    mono: '3x',
    result: '2x^2 - 3x + 4',
    explanation: '(6x^3 : 3x) - (9x^2 : 3x) + (12x : 3x) = 2x^2 - 3x + 4.'
  },
  {
    poly: '10x^4y^3 - 15x^3y^2',
    mono: '5x^2y^2',
    result: '2x^2y - 3x',
    explanation: '(10x^4y^3 : 5x^2y^2) - (15x^3y^2 : 5x^2y^2) = 2x^2y - 3x.'
  },
  {
    poly: '-8x^5y^2 + 12x^3y^4',
    mono: '-4x^2y^2',
    result: '2x^3 - 3y^2',
    explanation: '(-8x^5y^2 : -4x^2y^2) + (12x^3y^4 : -4x^2y^2) = 2x^3 - 3y^2.'
  },
  {
    poly: '15a^3b^2 - 20a^2b^3 + 5a^2b^2',
    mono: '5a^2b^2',
    result: '3a - 4b + 1',
    explanation: '(15a^3b^2 : 5a^2b^2) - (20a^2b^3 : 5a^2b^2) + (5a^2b^2 : 5a^2b^2) = 3a - 4b + 1.'
  }
];

const getRandomDivProblem = (): DivProblem => {
  return DIV_PROBLEMS[Math.floor(Math.random() * DIV_PROBLEMS.length)];
};

export default function ChiaDaThucInteractive() {
  const [prob, setProb] = useState<DivProblem>(getRandomDivProblem);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const handleNext = () => {
    setShowSolution(false);
    let nextP = getRandomDivProblem();
    while (nextP.poly === prob.poly && DIV_PROBLEMS.length > 1) {
      nextP = getRandomDivProblem();
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
        <span style={{ fontSize: '1.5rem' }}>➗</span>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Phép chia Đa thức cho Đơn thức
        </h3>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
        border: '2px solid #e9d5ff',
        borderRadius: '16px',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#6b21a8', fontWeight: 700, marginBottom: '0.75rem' }}>
          ➗ Thực hiện phép chia ngẫu nhiên:
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
          <KatexDisplay math={`(${prob.poly}) : (${prob.mono})`} block={true} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          {!showSolution ? (
            <button
              onClick={() => setShowSolution(true)}
              style={{
                background: '#9333ea',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(147, 51, 234, 0.2)'
              }}
            >
              👁️ Xem thương & Lời giải chi tiết
            </button>
          ) : (
            <div style={{
              marginTop: '1rem',
              padding: '1.25rem',
              borderRadius: '12px',
              background: '#ffffff',
              borderLeft: '5px solid #a855f7',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6b21a8', marginBottom: '0.5rem' }}>
                🎉 Kết quả thương: <KatexDisplay math={prob.result} />
              </div>
              <div style={{ color: '#334155', fontSize: '0.95rem' }}>
                <strong>Chia từng hạng tử:</strong> <KatexDisplay math={prob.explanation} />
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
