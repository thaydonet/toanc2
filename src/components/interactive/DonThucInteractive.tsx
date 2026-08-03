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

interface MonomialProblem {
  latex: string;
  isMonomial: boolean;
  explanation: string;
  coefficient?: string;
  variablePart?: string;
  degree?: string;
}

const MONOMIAL_TEMPLATES: MonomialProblem[] = [
  // Đơn thức (True)
  {
    latex: '3x^2y',
    isMonomial: true,
    explanation: '3x^2y chỉ gồm tích của số 3 và các biến x, y.',
    coefficient: '3',
    variablePart: 'x^2y',
    degree: '3 (vì 2 + 1 = 3)'
  },
  {
    latex: '-5x^3y^2z',
    isMonomial: true,
    explanation: '-5x^3y^2z là tích của số -5 và các biến x, y, z.',
    coefficient: '-5',
    variablePart: 'x^3y^2z',
    degree: '6 (vì 3 + 2 + 1 = 6)'
  },
  {
    latex: '-7',
    isMonomial: true,
    explanation: '-7 là một số thực (đơn thức hằng số khác 0).',
    coefficient: '-7',
    variablePart: 'Không có',
    degree: '0'
  },
  {
    latex: '\\dfrac{2}{5}x^4y',
    isMonomial: true,
    explanation: '\\dfrac{2}{5}x^4y là tích của phân số \\dfrac{2}{5} và các biến x, y.',
    coefficient: '\\dfrac{2}{5}',
    variablePart: 'x^4y',
    degree: '5 (vì 4 + 1 = 5)'
  },
  {
    latex: '-\\sqrt{3}xy^3',
    isMonomial: true,
    explanation: '-\\sqrt{3}xy^3 có hệ số là số thực -\\sqrt{3} và phần biến xy^3.',
    coefficient: '-\\sqrt{3}',
    variablePart: 'xy^3',
    degree: '4 (vì 1 + 3 = 4)'
  },
  {
    latex: 'x^5',
    isMonomial: true,
    explanation: 'x^5 là một biến nâng lên lũy thừa (hệ số ngầm hiểu là 1).',
    coefficient: '1',
    variablePart: 'x^5',
    degree: '5'
  },
  {
    latex: '-y',
    isMonomial: true,
    explanation: '-y là một biến với hệ số là -1.',
    coefficient: '-1',
    variablePart: 'y',
    degree: '1'
  },
  {
    latex: '2x^2 \\cdot 3xy',
    isMonomial: true,
    explanation: '2x^2 \\cdot 3xy là tích các số và biến (đơn thức chưa thu gọn, thu gọn là 6x^3y).',
    coefficient: '6 (sau thu gọn)',
    variablePart: 'x^3y (sau thu gọn)',
    degree: '4 (sau thu gọn)'
  },

  // KHÔNG phải đơn thức (False)
  {
    latex: 'x + 2y',
    isMonomial: false,
    explanation: 'x + 2y chứa phép cộng giữa các số hạng nên là đa thức, KHÔNG phải đơn thức.'
  },
  {
    latex: '3x^2 - 5y + 1',
    isMonomial: false,
    explanation: 'Biểu thức chứa phép trừ và phép cộng nên KHÔNG phải đơn thức.'
  },
  {
    latex: '\\dfrac{4x}{y}',
    isMonomial: false,
    explanation: 'Biểu thức chứa phép chia cho biến y ở mẫu số nên KHÔNG phải đơn thức.'
  },
  {
    latex: '\\dfrac{5}{x^2}',
    isMonomial: false,
    explanation: 'Biểu thức chứa biến x ở mẫu số nên KHÔNG phải đơn thức.'
  },
  {
    latex: '\\sqrt{x} \\cdot y',
    isMonomial: false,
    explanation: 'Biểu thức chứa biến x nằm trong căn thức \\sqrt{x} nên KHÔNG phải đơn thức.'
  },
  {
    latex: 'x^2 - y^2',
    isMonomial: false,
    explanation: 'Biểu thức chứa phép trừ giữa hai số hạng x^2 và y^2 nên KHÔNG phải đơn thức.'
  },
  {
    latex: '\\dfrac{x + 1}{y}',
    isMonomial: false,
    explanation: 'Biểu thức có phép cộng ở tử và biến ở mẫu nên KHÔNG phải đơn thức.'
  }
];

const getRandomProblem = (): MonomialProblem => {
  const index = Math.floor(Math.random() * MONOMIAL_TEMPLATES.length);
  return MONOMIAL_TEMPLATES[index];
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

export default function DonThucInteractive() {
  const [tab, setTab] = useState<'check' | 'explorer' | 'calc'>('check');

  // ── Tab 1: Random True/False Quiz ──────────────────────────────────────────
  const [problem, setProblem] = useState<MonomialProblem>(getRandomProblem);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [totalAttempted, setTotalAttempted] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const handleAnswer = (choice: boolean) => {
    if (userChoice !== null) return; // already answered
    setUserChoice(choice);
    setTotalAttempted(prev => prev + 1);

    if (choice === problem.isMonomial) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    setUserChoice(null);
    let nextProb = getRandomProblem();
    // Avoid exact duplicate consecutive questions if possible
    while (nextProb.latex === problem.latex && MONOMIAL_TEMPLATES.length > 1) {
      nextProb = getRandomProblem();
    }
    setProblem(nextProb);
  };

  // ── Tab 2: Khám phá đơn thức ───────────────────────────────────────────────
  const [coeff, setCoeff] = useState<number>(3);
  const [expX, setExpX] = useState<number>(2);
  const [expY, setExpY] = useState<number>(1);
  const [expZ, setExpZ] = useState<number>(0);

  const totalDegree = expX + expY + expZ;

  const renderVarPartLatex = () => {
    let str = '';
    if (expX > 0) str += expX === 1 ? 'x' : `x^{${expX}}`;
    if (expY > 0) str += expY === 1 ? 'y' : `y^{${expY}}`;
    if (expZ > 0) str += expZ === 1 ? 'z' : `z^{${expZ}}`;
    return str || '1';
  };

  const renderFullMonomialLatex = () => {
    const varP = renderVarPartLatex();
    if (coeff === 0) return '0';
    if (varP === '1') return `${coeff}`;
    if (coeff === 1) return varP;
    if (coeff === -1) return `-${varP}`;
    return `${coeff}${varP}`;
  };

  // ── Tab 3: Phép toán đơn thức ──────────────────────────────────────────────
  const [opCoeff1, setOpCoeff1] = useState<number>(4);
  const [opCoeff2, setOpCoeff2] = useState<number>(-2);
  const [opExpX1, setOpExpX1] = useState<number>(2);
  const [opExpY1, setOpExpY1] = useState<number>(3);

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
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.25rem',
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '1.5rem' }}>🧮</span>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Khám phá & Nhận biết Đơn thức
        </h3>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button style={tabBtnStyle(tab === 'check')} onClick={() => setTab('check')}>
          1. Phân loại đơn thức (Luyện tập ngẫu nhiên)
        </button>
        <button style={tabBtnStyle(tab === 'explorer')} onClick={() => setTab('explorer')}>
          2. Khám phá cấu trúc đơn thức
        </button>
        <button style={tabBtnStyle(tab === 'calc')} onClick={() => setTab('calc')}>
          3. Phép toán đơn thức
        </button>
      </div>

      {/* Tab 1: Phân loại đơn thức (Random Quiz) */}
      {tab === 'check' && (
        <div>
          {/* Score Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                🎯 Điểm số: <span style={{ color: '#2563eb', fontSize: '1.1rem' }}>{score}</span> / {totalAttempted}
              </span>
              {streak >= 2 && (
                <span style={{
                  background: '#fef3c7',
                  color: '#b45309',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid #fde68a'
                }}>
                  🔥 Chuỗi {streak} câu đúng!
                </span>
              )}
            </div>

            <button
              onClick={handleNextQuestion}
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🎲 Đổi câu hỏi ngẫu nhiên
            </button>
          </div>

          {/* Main Quiz Card */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '2px solid #7dd3fc',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.08)'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#0369a1',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.75rem'
            }}>
              🔍 Câu hỏi nhận biết:
            </div>

            {/* Expression Display */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '1.25rem 2rem',
              display: 'inline-block',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              margin: '0.5rem 0 1.25rem 0',
              border: '1px solid #bae6fd',
              fontSize: '1.8rem',
              minWidth: '220px'
            }}>
              <KatexDisplay math={problem.latex} block={true} />
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0c4a6e', marginBottom: '1.25rem' }}>
              Biểu thức trên có phải là <span style={{ color: '#0284c7', textDecoration: 'underline' }}>ĐƠN THỨC</span> không?
            </div>

            {/* Answer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
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
                  cursor: userChoice !== null ? 'default' : 'pointer',
                  opacity: userChoice !== null && userChoice !== true ? 0.5 : 1,
                  transition: 'all 0.2s',
                  boxShadow: userChoice === null ? '0 2px 4px rgba(22, 163, 74, 0.15)' : 'none'
                }}
              >
                ✅ ĐÚNG (Là Đơn thức)
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
                  cursor: userChoice !== null ? 'default' : 'pointer',
                  opacity: userChoice !== null && userChoice !== false ? 0.5 : 1,
                  transition: 'all 0.2s',
                  boxShadow: userChoice === null ? '0 2px 4px rgba(220, 38, 38, 0.15)' : 'none'
                }}
              >
                ❌ SAI (Không phải Đơn thức)
              </button>
            </div>

            {/* Feedback & Detailed Explanation */}
            {userChoice !== null && (
              <div style={{
                marginTop: '1.25rem',
                padding: '1.25rem',
                borderRadius: '12px',
                background: '#ffffff',
                borderLeft: `5px solid ${userChoice === problem.isMonomial ? '#22c55e' : '#ef4444'}`,
                textAlign: 'left',
                animation: 'fadeIn 0.3s ease-in-out'
              }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: userChoice === problem.isMonomial ? '#15803d' : '#b91c1c',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {userChoice === problem.isMonomial ? '🎉 Chính xác!' : '⚠️ Chưa chính xác!'}
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
                    (Kết quả đúng là: <strong>{problem.isMonomial ? 'Là Đơn thức' : 'Không phải Đơn thức'}</strong>)
                  </span>
                </div>

                <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  <strong>Giải thích:</strong> <KatexDisplay math={problem.explanation} />
                </div>

                {problem.isMonomial && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                    fontSize: '0.9rem'
                  }}>
                    <div>• Hệ số: <strong><KatexDisplay math={problem.coefficient || ''} /></strong></div>
                    <div>• Phần biến: <strong><KatexDisplay math={problem.variablePart || ''} /></strong></div>
                    <div>• Bậc: <strong>{problem.degree}</strong></div>
                  </div>
                )}

                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                  <button
                    onClick={handleNextQuestion}
                    style={{
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.6rem 1.25rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
                      transition: 'all 0.2s'
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

      {/* Tab 2: Khám phá cấu trúc đơn thức */}
      {tab === 'explorer' && (
        <div>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            Điều chỉnh hệ số và số mũ các biến để quan sát cấu trúc đơn thức tự động:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Control Panel */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1rem', fontWeight: 700 }}>
                ⚙️ Điều chỉnh thành phần:
              </h4>

              {/* Hệ số */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                  <span>Hệ số (A):</span>
                  <span style={{ color: '#2563eb', fontWeight: 700 }}>{coeff}</span>
                </label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={coeff}
                  onChange={(e) => setCoeff(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '0.3rem' }}
                />
              </div>

              {/* Số mũ x */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                  <span>Số mũ của biến x:</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{expX}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={expX}
                  onChange={(e) => setExpX(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '0.3rem' }}
                />
              </div>

              {/* Số mũ y */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                  <span>Số mũ của biến y:</span>
                  <span style={{ color: '#d97706', fontWeight: 700 }}>{expY}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={expY}
                  onChange={(e) => setExpY(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '0.3rem' }}
                />
              </div>

              {/* Số mũ z */}
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                  <span>Số mũ của biến z:</span>
                  <span style={{ color: '#9333ea', fontWeight: 700 }}>{expZ}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={expZ}
                  onChange={(e) => setExpZ(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '0.3rem' }}
                />
              </div>
            </div>

            {/* Live Result Display */}
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '2px solid #bfdbfe', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                  Đơn thức thu gọn
                </span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e3a8a', margin: '0.5rem 0' }}>
                  <KatexDisplay math={renderFullMonomialLatex()} block={true} />
                </div>
              </div>

              <div style={{ background: '#f0f9ff', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #bae6fd', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#0369a1', fontWeight: 600 }}>• Hệ số:</span>
                  <span style={{ fontWeight: 700, color: '#1e40af' }}>{coeff}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #bae6fd', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#0369a1', fontWeight: 600 }}>• Phần biến:</span>
                  <span style={{ fontWeight: 700, color: '#047857' }}>
                    <KatexDisplay math={renderVarPartLatex()} />
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #bae6fd', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#0369a1', fontWeight: 600 }}>• Tổng số mũ:</span>
                  <span style={{ fontWeight: 700, color: '#b45309' }}>
                    {coeff !== 0 ? (totalDegree === 0 ? '0 (hằng số)' : `${expX} + ${expY} + ${expZ} = ${totalDegree}`) : 'Không xác định (số 0)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#0369a1', fontWeight: 600 }}>• Đơn thức đồng dạng mẫu:</span>
                  <span style={{ fontWeight: 700, color: '#6b21a8' }}>
                    <KatexDisplay math={`-7${renderVarPartLatex()}`} />, <KatexDisplay math={`10,5${renderVarPartLatex()}`} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Phép toán đơn thức */}
      {tab === 'calc' && (
        <div>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            Quan sát kết quả của phép <strong>Cộng</strong> và phép <strong>Nhân</strong> hai đơn thức:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Đơn thức A */}
            <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '0.95rem' }}>Đơn thức A</h5>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem' }}>Hệ số A:</label>
                <input
                  type="number"
                  value={opCoeff1}
                  onChange={(e) => setOpCoeff1(Number(e.target.value))}
                  style={{ width: '60px', padding: '0.25rem', borderRadius: '4px', border: '1px solid #93c5fd' }}
                />
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 700, color: '#1d4ed8' }}>
                <KatexDisplay math={`A = ${opCoeff1}x^{${opExpX1}}y^{${opExpY1}}`} />
              </div>
            </div>

            {/* Đơn thức B */}
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#166534', fontSize: '0.95rem' }}>Đơn thức B (Đồng dạng A)</h5>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem' }}>Hệ số B:</label>
                <input
                  type="number"
                  value={opCoeff2}
                  onChange={(e) => setOpCoeff2(Number(e.target.value))}
                  style={{ width: '60px', padding: '0.25rem', borderRadius: '4px', border: '1px solid #86efac' }}
                />
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 700, color: '#15803d' }}>
                <KatexDisplay math={`B = ${opCoeff2}x^{${opExpX1}}y^{${opExpY1}}`} />
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* Phép cộng */}
            <div style={{ background: '#faf5ff', padding: '1rem', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
              <div style={{ fontWeight: 700, color: '#6b21a8', marginBottom: '0.5rem' }}>
                ➕ Phép cộng (A + B):
              </div>
              <div style={{ fontSize: '0.9rem', color: '#4a044e', marginBottom: '0.4rem' }}>
                Cộng hệ số, giữ nguyên phần biến <KatexDisplay math={`x^{${opExpX1}}y^{${opExpY1}}`} />:
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#7e22ce' }}>
                <KatexDisplay math={`(${opCoeff1} + ${opCoeff2})x^{${opExpX1}}y^{${opExpY1}} = ${opCoeff1 + opCoeff2}x^{${opExpX1}}y^{${opExpY1}}`} />
              </div>
            </div>

            {/* Phép nhân */}
            <div style={{ background: '#fff7ed', padding: '1rem', borderRadius: '10px', border: '1px solid #fed7aa' }}>
              <div style={{ fontWeight: 700, color: '#c2410c', marginBottom: '0.5rem' }}>
                ✖️ Phép nhân (A · B):
              </div>
              <div style={{ fontSize: '0.9rem', color: '#7c2d12', marginBottom: '0.4rem' }}>
                Nhân hệ số với nhau, cộng số mũ các biến tương ứng:
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ea580c' }}>
                <KatexDisplay math={`(${opCoeff1} \\cdot ${opCoeff2})x^{${opExpX1} + ${opExpX1}}y^{${opExpY1} + ${opExpY1}} = ${opCoeff1 * opCoeff2}x^{${opExpX1 * 2}}y^{${opExpY1 * 2}}`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
