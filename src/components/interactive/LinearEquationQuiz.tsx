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

const formatLinearEq = (a: number, b: number, c: number) => {
  const formatTerm = (n: number, v: string, isFirst: boolean) => {
    if (n === 0) return '';
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : (isFirst ? '' : '+');
    const val = abs === 1 ? '' : abs;
    return `${sign}${isFirst ? '' : ' '}${val}${v}`;
  };
  let lhs = `${formatTerm(a, 'x', true)} ${formatTerm(b, 'y', a === 0)}`.trim();
  if (lhs === '') lhs = '0';
  return `${lhs} = ${c}`;
};

type Problem = {
  type: 'identify' | 'solve';
  eq: string;
  x: number;
  y: number;
  isCorrect: boolean;
};

const generateProblem = (type: 'identify' | 'solve'): Problem => {
  if (type === 'identify') {
    const isLinear = Math.random() > 0.4;
    let eq = '';
    if (isLinear) {
      const a = Math.floor(Math.random() * 10) - 5 || 1;
      const b = Math.floor(Math.random() * 10) - 5 || 1;
      const c = Math.floor(Math.random() * 10) - 5;
      eq = formatLinearEq(a, b, c);
    } else {
      const variants = [
        `x^2 + ${Math.floor(Math.random() * 5)}y = 2`,
        `x^3 + y = 5`,
        `2xy = 10`,
        `x + y^2 = 4`,
        `\\frac{1}{x} + y = 3`
      ];
      eq = variants[Math.floor(Math.random() * variants.length)];
    }
    return { type: 'identify', eq, x: 0, y: 0, isCorrect: isLinear };
  } else {
    const a = Math.floor(Math.random() * 10) - 5 || 1;
    const b = Math.floor(Math.random() * 10) - 5 || 1;
    const x = Math.floor(Math.random() * 10) - 5;
    const y = Math.floor(Math.random() * 10) - 5;
    const c = a * x + b * y;
    const eq = formatLinearEq(a, b, c);
    const isCorrect = Math.random() > 0.5;
    const tx = isCorrect ? x : x + (Math.floor(Math.random() * 3) - 1 || 1);
    const ty = isCorrect ? y : y + (Math.floor(Math.random() * 3) - 1 || 1);
    return { type: 'solve', eq, x: tx, y: ty, isCorrect };
  }
};

const QuizCard = ({ problem, onAnswer, feedback, colorScheme }: {
  problem: Problem;
  onAnswer: (correct: boolean) => void;
  feedback: { text: string; type: 'correct' | 'wrong' | null };
  colorScheme: 'amber' | 'sky';
}) => {
  const isIdentify = problem.type === 'identify';
  const [hoveredBtn, setHoveredBtn] = useState<'true' | 'false' | null>(null);

  const colors = colorScheme === 'amber'
    ? { cardBg: '#fffbeb', cardBorder: '#fcd34d', badgeBg: '#f59e0b', titleColor: '#92400e', subColor: '#d97706', eqBg: '#fef3c7', eqColor: '#b45309' }
    : { cardBg: '#f0f9ff', cardBorder: '#7dd3fc', badgeBg: '#0ea5e9', titleColor: '#075985', subColor: '#0369a1', eqBg: '#e0f2fe', eqColor: '#0c4a6e' };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      borderRadius: '16px',
      border: `2px solid ${colors.cardBorder}`,
      backgroundColor: colors.cardBg,
      minHeight: '260px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: colors.badgeBg, color: 'white',
          fontSize: '14px', fontWeight: 'bold', flexShrink: 0,
        }}>
          {isIdentify ? '1' : '2'}
        </span>
        <div>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: colors.titleColor }}>
            {isIdentify ? '🔍 Nhận biết' : '✅ Kiểm tra nghiệm'}
          </h4>
          <p style={{ margin: 0, fontSize: '12px', color: colors.subColor }}>
            {isIdentify
              ? 'Phương trình đã cho có phải PT bậc nhất hai ẩn?'
              : 'Cặp số (x; y) có là nghiệm của PT?'}
          </p>
        </div>
      </div>

      {/* Equation display */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '16px', borderRadius: '12px',
        backgroundColor: 'white', border: '1px solid #e5e7eb',
        marginBottom: '16px', maxWidth: '100%', overflowX: 'auto',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Phương trình</div>
        <div style={{
          fontSize: '18px', fontWeight: 'bold', padding: '8px 16px',
          borderRadius: '8px', backgroundColor: colors.eqBg, color: colors.eqColor,
          maxWidth: '100%', overflowX: 'auto', textAlign: 'center',
        }}>
          <KatexDisplay math={problem.eq} block={true} />
        </div>
        {!isIdentify && (
          <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
            Kiểm tra cặp số:{' '}
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
              <KatexDisplay math={`(${problem.x}; ${problem.y})`} />
            </span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onAnswer(true)}
          onMouseEnter={() => setHoveredBtn('true')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            padding: '8px 24px',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: '15px',
            color: 'white',
            backgroundColor: hoveredBtn === 'true' ? '#16a34a' : '#22c55e',
            border: 'none',
            borderBottom: '4px solid #15803d',
            boxShadow: '0 4px 0 #15803d',
            cursor: 'pointer',
            minWidth: '90px',
            transform: hoveredBtn === 'true' ? 'translateY(2px)' : 'translateY(0)',
            transition: 'all 0.15s ease',
            outline: 'none',
          }}
        >
          ✓ Đúng
        </button>
        <button
          onClick={() => onAnswer(false)}
          onMouseEnter={() => setHoveredBtn('false')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            padding: '8px 24px',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: '15px',
            color: 'white',
            backgroundColor: hoveredBtn === 'false' ? '#dc2626' : '#ef4444',
            border: 'none',
            borderBottom: '4px solid #b91c1c',
            boxShadow: '0 4px 0 #b91c1c',
            cursor: 'pointer',
            minWidth: '90px',
            transform: hoveredBtn === 'false' ? 'translateY(2px)' : 'translateY(0)',
            transition: 'all 0.15s ease',
            outline: 'none',
          }}
        >
          ✗ Sai
        </button>
      </div>

      {/* Feedback */}
      <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
        {feedback.text && (
          <div style={{
            fontSize: '14px', fontWeight: 'bold',
            padding: '6px 16px', borderRadius: '999px',
            backgroundColor: feedback.type === 'correct' ? '#d1fae5' : '#fee2e2',
            color: feedback.type === 'correct' ? '#065f46' : '#991b1b',
          }}>
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

const LinearEquationQuiz = () => {
  const [problems, setProblems] = useState<Problem[]>([
    generateProblem('identify'),
    generateProblem('solve'),
  ]);
  const [feedbacks, setFeedbacks] = useState<{ text: string; type: 'correct' | 'wrong' | null }[]>([
    { text: '', type: null },
    { text: '', type: null },
  ]);
  const [scores, setScores] = useState([0, 0]);

  useEffect(() => {
    setProblems([generateProblem('identify'), generateProblem('solve')]);
  }, []);

  const handleAnswer = (index: number, userChoice: boolean) => {
    const correct = userChoice === problems[index].isCorrect;
    setFeedbacks(prev => {
      const next = [...prev];
      next[index] = {
        text: correct ? 'Chính xác! ✅' : 'Chưa đúng! ❌',
        type: correct ? 'correct' : 'wrong',
      };
      return next;
    });
    if (correct) {
      setScores(prev => {
        const next = [...prev];
        next[index] += 10;
        return next;
      });
    } else {
      setScores(prev => {
        const next = [...prev];
        next[index] = Math.max(0, next[index] - 5);
        return next;
      });
    }
    setTimeout(() => {
      setProblems(prev => {
        const next = [...prev];
        next[index] = generateProblem(prev[index].type);
        return next;
      });
      setFeedbacks(prev => {
        const next = [...prev];
        next[index] = { text: '', type: null };
        return next;
      });
    }, 1500);
  };

  const totalScore = scores[0] + scores[1];

  return (
    <div className="p-4 sm:p-6" style={{
      backgroundColor: '#f8fafc',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      margin: '24px 0',
      maxWidth: '900px',
      marginLeft: 'auto',
      marginRight: 'auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: 'linear-gradient(to right, #06b6d4, #3b82f6, #6366f1)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#334155' }}>
          📘 Luyện tập - Phương trình bậc nhất hai ẩn
        </h3>
        <div style={{
          background: 'linear-gradient(to right, #3b82f6, #6366f1)',
          color: 'white', padding: '6px 16px', borderRadius: '999px',
          fontWeight: 'bold', fontSize: '14px',
          boxShadow: '0 2px 6px rgba(99,102,241,0.4)',
          display: 'flex', alignItems: 'center', gap: '6px',
          flexShrink: 0,
        }}>
          <span>🏆</span><span>{totalScore}</span>
        </div>
      </div>

      {/* Grid 1 column on mobile, 2 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuizCard
          problem={problems[0]}
          onAnswer={(choice) => handleAnswer(0, choice)}
          feedback={feedbacks[0]}
          colorScheme="amber"
        />
        <QuizCard
          problem={problems[1]}
          onAnswer={(choice) => handleAnswer(1, choice)}
          feedback={feedbacks[1]}
          colorScheme="sky"
        />
      </div>
    </div>
  );
};

export default LinearEquationQuiz;
