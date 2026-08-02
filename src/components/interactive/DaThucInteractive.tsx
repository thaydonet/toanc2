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

interface PolynomialProblem {
  latex: string;
  isPolynomial: boolean;
  explanation: string;
  degree?: string;
  terms?: string;
}

const POLYNOMIAL_TEMPLATES: PolynomialProblem[] = [
  // Đa thức (True)
  {
    latex: '3x^2 + 2x - 5',
    isPolynomial: true,
    explanation: '3x^2 + 2x - 5 là tổng của ba đơn thức 3x^2, 2x và -5.',
    degree: '2 (của hạng tử 3x^2)',
    terms: '3x^2; 2x; -5'
  },
  {
    latex: 'x^3y - 2xy^2 + 5',
    isPolynomial: true,
    explanation: 'x^3y - 2xy^2 + 5 là đa thức nhiều biến gồm ba hạng tử.',
    degree: '4 (của hạng tử x^3y)',
    terms: 'x^3y; -2xy^2; 5'
  },
  {
    latex: '-7x^4 + 3',
    isPolynomial: true,
    explanation: '-7x^4 + 3 là đa thức bậc 4 với 2 hạng tử.',
    degree: '4',
    terms: '-7x^4; 3'
  },
  {
    latex: '\\dfrac{1}{2}x^2y^3 - 4xy + 1',
    isPolynomial: true,
    explanation: 'Các hệ số là số thực, biến có số mũ nguyên dương nên là đa thức.',
    degree: '5 (của hạng tử \\dfrac{1}{2}x^2y^3)',
    terms: '\\dfrac{1}{2}x^2y^3; -4xy; 1'
  },
  {
    latex: 'x^5 - 3x^3 + x - 9',
    isPolynomial: true,
    explanation: 'Đa thức 1 biến đã sắp xếp theo bậc giảm dần.',
    degree: '5',
    terms: 'x^5; -3x^3; x; -9'
  },

  // KHÔNG phải đa thức (False)
  {
    latex: '\\dfrac{2x + 1}{y}',
    isPolynomial: false,
    explanation: 'Biểu thức có chứa phép chia cho biến y ở mẫu nên KHÔNG phải là đa thức.'
  },
  {
    latex: 'x^2 + \\dfrac{3}{x} - 4',
    isPolynomial: false,
    explanation: 'Có hạng tử \\dfrac{3}{x} chứa biến x ở mẫu số nên KHÔNG phải là đa thức.'
  },
  {
    latex: '3\\sqrt{x} + 2y',
    isPolynomial: false,
    explanation: 'Có chứa biến x dưới dấu căn \\sqrt{x} nên KHÔNG phải là đa thức.'
  },
  {
    latex: '\\dfrac{x^2 - y^2}{x + y}',
    isPolynomial: false,
    explanation: 'Là thương của hai đa thức (phân thức đại số), KHÔNG phải là đa thức.'
  }
];

const getRandomProblem = (): PolynomialProblem => {
  return POLYNOMIAL_TEMPLATES[Math.floor(Math.random() * POLYNOMIAL_TEMPLATES.length)];
};

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '0.55rem 1.1rem',
  borderRadius: '10px',
  border: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  cursor: 'pointer',
  backgroundColor: active ? '#2563eb' : '#f1f5f9',
  color: active ? '#ffffff' : '#475569',
  transition: 'all 0.2s ease',
  boxShadow: active ? '0 4px 6px -1px rgba(37, 99, 235, 0.25)' : 'none',
});

export default function DaThucInteractive() {
  const [tab, setTab] = useState<'check' | 'eval'>('check');

  // Tab 1: Random Quiz
  const [problem, setProblem] = useState<PolynomialProblem>(getRandomProblem);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [totalAttempted, setTotalAttempted] = useState<number>(0);

  const handleAnswer = (choice: boolean) => {
    if (userChoice !== null) return;
    setUserChoice(choice);
    setTotalAttempted(prev => prev + 1);
    if (choice === problem.isPolynomial) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    setUserChoice(null);
    let nextProb = getRandomProblem();
    while (nextProb.latex === problem.latex && POLYNOMIAL_TEMPLATES.length > 1) {
      nextProb = getRandomProblem();
    }
    setProblem(nextProb);
  };

  // Tab 2: Evaluate P(x) = ax^2 + bx + c
  const [a, setA] = useState<number>(2);
  const [b, setB] = useState<number>(-3);
  const [c, setC] = useState<number>(5);
  const [valX, setValX] = useState<number>(2);

  const pVal = a * valX * valX + b * valX + c;

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
        <span style={{ fontSize: '1.5rem' }}>🧩</span>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Khám phá & Nhận biết Đa thức
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button style={tabBtnStyle(tab === 'check')} onClick={() => setTab('check')}>
          1. Phân loại Đa thức (Luyện tập ngẫu nhiên)
        </button>
        <button style={tabBtnStyle(tab === 'eval')} onClick={() => setTab('eval')}>
          2. Tính giá trị đa thức P(x)
        </button>
      </div>

      {tab === 'check' && (
        <div>
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            marginBottom: '1.25rem'
          }}>
            <span style={{ fontWeight: 700, color: '#1e293b' }}>
              🎯 Điểm số: <span style={{ color: '#2563eb', fontSize: '1.1rem' }}>{score}</span> / {totalAttempted}
            </span>
            <button
              onClick={handleNext}
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🎲 Đổi câu hỏi ngẫu nhiên
            </button>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '2px solid #7dd3fc',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: 700, marginBottom: '0.75rem' }}>
              🔍 Câu hỏi nhận biết:
            </div>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '1.25rem 2rem',
              display: 'inline-block',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              margin: '0.5rem 0 1.25rem 0',
              fontSize: '1.8rem'
            }}>
              <KatexDisplay math={problem.latex} block={true} />
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0c4a6e', marginBottom: '1.25rem' }}>
              Biểu thức trên có phải là <span style={{ color: '#0284c7', textDecoration: 'underline' }}>ĐA THỨC</span> không?
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <button
                onClick={() => handleAnswer(true)}
                disabled={userChoice !== null}
                style={{
                  padding: '0.75rem 1.75rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: '2px solid #16a34a',
                  background: userChoice === true ? '#16a34a' : '#f0fdf4',
                  color: userChoice === true ? '#ffffff' : '#15803d',
                  cursor: userChoice !== null ? 'default' : 'pointer'
                }}
              >
                ✅ ĐÚNG (Là Đa thức)
              </button>

              <button
                onClick={() => handleAnswer(false)}
                disabled={userChoice !== null}
                style={{
                  padding: '0.75rem 1.75rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: '2px solid #dc2626',
                  background: userChoice === false ? '#dc2626' : '#fef2f2',
                  color: userChoice === false ? '#ffffff' : '#b91c1c',
                  cursor: userChoice !== null ? 'default' : 'pointer'
                }}
              >
                ❌ SAI (Không phải Đa thức)
              </button>
            </div>

            {userChoice !== null && (
              <div style={{
                marginTop: '1.25rem',
                padding: '1.25rem',
                borderRadius: '12px',
                background: '#ffffff',
                borderLeft: `5px solid ${userChoice === problem.isPolynomial ? '#22c55e' : '#ef4444'}`,
                textAlign: 'left'
              }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: userChoice === problem.isPolynomial ? '#15803d' : '#b91c1c',
                  marginBottom: '0.5rem'
                }}>
                  {userChoice === problem.isPolynomial ? '🎉 Chính xác!' : '⚠️ Chưa chính xác!'}
                </div>
                <div style={{ color: '#334155', fontSize: '0.95rem' }}>
                  <strong>Giải thích:</strong> <KatexDisplay math={problem.explanation} />
                </div>
                {problem.isPolynomial && (
                  <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: '#f0fdf4', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <div>• Các hạng tử: <strong><KatexDisplay math={problem.terms || ''} /></strong></div>
                    <div>• Bậc đa thức: <strong>{problem.degree}</strong></div>
                  </div>
                )}
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
                    🔄 Câu hỏi tiếp theo ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'eval' && (
        <div>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            Điều chỉnh hệ số $a, b, c$ và giá trị của $x$ để tính tự động giá trị của $P(x) = ax^2 + bx + c$:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span>Hệ số a:</span> <span style={{ color: '#2563eb', fontWeight: 700 }}>{a}</span>
                </label>
                <input type="range" min="-5" max="5" value={a} onChange={e => setA(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span>Hệ số b:</span> <span style={{ color: '#059669', fontWeight: 700 }}>{b}</span>
                </label>
                <input type="range" min="-5" max="5" value={b} onChange={e => setB(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span>Hệ số c:</span> <span style={{ color: '#d97706', fontWeight: 700 }}>{c}</span>
                </label>
                <input type="range" min="-5" max="5" value={c} onChange={e => setC(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span>Giá trị x:</span> <span style={{ color: '#9333ea', fontWeight: 700 }}>{valX}</span>
                </label>
                <input type="range" min="-5" max="5" value={valX} onChange={e => setValX(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '2px solid #bfdbfe', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Đa thức P(x)
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e3a8a', margin: '0.5rem 0' }}>
                <KatexDisplay math={`P(x) = ${a}x^2 + (${b})x + (${c})`} />
              </div>
              <div style={{ marginTop: '1rem', background: '#f0f9ff', padding: '1rem', borderRadius: '8px', textAlign: 'left' }}>
                <div style={{ color: '#0369a1', fontWeight: 600 }}>
                  Thay $x = {valX}$ vào $P(x)$:
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e40af', marginTop: '0.5rem' }}>
                  <KatexDisplay math={`P(${valX}) = ${a} \\cdot (${valX})^2 + (${b}) \\cdot (${valX}) + (${c}) = ${pVal}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
