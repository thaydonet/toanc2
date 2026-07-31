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
  eqStr: string;
  x: number;
  y: number;
  isCorrect: boolean;
};

const generateProblem = (type: 'identify' | 'solve'): Problem => {
  if (type === 'identify') {
    const isSystem = Math.random() > 0.4;
    if (isSystem) {
      const a1 = Math.floor(Math.random() * 10) - 5 || 1;
      const b1 = Math.floor(Math.random() * 10) - 5 || 1;
      const c1 = Math.floor(Math.random() * 10) - 5;
      const a2 = Math.floor(Math.random() * 10) - 5 || 1;
      const b2 = Math.floor(Math.random() * 10) - 5 || 1;
      const c2 = Math.floor(Math.random() * 10) - 5;
      const eqStr = `\\begin{cases} ${formatLinearEq(a1, b1, c1)} \\\\ ${formatLinearEq(a2, b2, c2)} \\end{cases}`;
      return { type: 'identify', eqStr, x: 0, y: 0, isCorrect: true };
    } else {
      const variants = [
        `\\begin{cases} x^2 + y = 3 \\\\ 2x - y = 1 \\end{cases}`,
        `x + y = 5`,
        `\\begin{cases} x^3 + y = 2 \\\\ x - y = 1 \\end{cases}`,
        `\\begin{cases} x + y = 3 \\\\ x^2 - y = 1 \\end{cases}`
      ];
      const eqStr = variants[Math.floor(Math.random() * variants.length)];
      return { type: 'identify', eqStr, x: 0, y: 0, isCorrect: false };
    }
  } else {
    const x = Math.floor(Math.random() * 10) - 5;
    const y = Math.floor(Math.random() * 10) - 5;
    const a1 = Math.floor(Math.random() * 10) - 5 || 1;
    const b1 = Math.floor(Math.random() * 10) - 5 || 1;
    const c1 = a1 * x + b1 * y;
    const a2 = Math.floor(Math.random() * 10) - 5 || 1;
    const b2 = Math.floor(Math.random() * 10) - 5 || 1;
    const c2 = a2 * x + b2 * y;

    const isCorrect = Math.random() > 0.5;
    const tx = isCorrect ? x : x + (Math.floor(Math.random() * 3) - 1 || 1);
    const ty = isCorrect ? y : y + (Math.floor(Math.random() * 3) - 1 || 1);

    const eqStr = `\\begin{cases} ${formatLinearEq(a1, b1, c1)} \\\\ ${formatLinearEq(a2, b2, c2)} \\end{cases}`;
    return { type: 'solve', eqStr, x: tx, y: ty, isCorrect };
  }
};

const QuizCard = ({ problem, onAnswer, feedback, index }: {
  problem: Problem;
  onAnswer: (correct: boolean) => void;
  feedback: { text: string; type: 'correct' | 'wrong' | null };
  index: number;
}) => {
  const isIdentify = problem.type === 'identify';
  const [hoveredBtn, setHoveredBtn] = useState<'true' | 'false' | null>(null);

  const colorSets = [
    { cardBg: '#fdf4ff', cardBorder: '#e879f9', badgeBg: '#a855f7', titleColor: '#6b21a8', subColor: '#9333ea', eqBg: '#fae8ff', eqColor: '#7e22ce' },
    { cardBg: '#f5f3ff', cardBorder: '#a78bfa', badgeBg: '#7c3aed', titleColor: '#4c1d95', subColor: '#6d28d9', eqBg: '#ede9fe', eqColor: '#5b21b6' },
  ];
  const colors = colorSets[index % 2];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      borderRadius: '16px',
      border: `2px solid ${colors.cardBorder}`,
      backgroundColor: colors.cardBg,
      minHeight: '280px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
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
              ? 'Hệ đã cho có phải hệ PT bậc nhất hai ẩn?'
              : 'Cặp số (x; y) có là nghiệm của hệ?'}
          </p>
        </div>
      </div>

      {/* Equation display */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '16px', borderRadius: '12px',
        backgroundColor: 'white', border: '1px solid #e5e7eb',
        marginBottom: '16px',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
          {isIdentify ? 'Hệ phương trình' : 'Hệ phương trình'}
        </div>
        <div style={{
          fontSize: '17px', fontWeight: 'bold', padding: '10px 20px',
          borderRadius: '8px', backgroundColor: colors.eqBg, color: colors.eqColor,
        }}>
          <KatexDisplay math={problem.eqStr} block={true} />
        </div>
        {!isIdentify && (
          <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
            Kiểm tra cặp số:{' '}
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
              <KatexDisplay math={`(${problem.x}; ${problem.y})`} />
            </span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <button
          onClick={() => onAnswer(true)}
          onMouseEnter={() => setHoveredBtn('true')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            padding: '10px 32px',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: '16px',
            color: 'white',
            backgroundColor: hoveredBtn === 'true' ? '#16a34a' : '#22c55e',
            border: 'none',
            borderBottom: '4px solid #15803d',
            boxShadow: '0 4px 0 #15803d',
            cursor: 'pointer',
            minWidth: '100px',
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
            padding: '10px 32px',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: '16px',
            color: 'white',
            backgroundColor: hoveredBtn === 'false' ? '#dc2626' : '#ef4444',
            border: 'none',
            borderBottom: '4px solid #b91c1c',
            boxShadow: '0 4px 0 #b91c1c',
            cursor: 'pointer',
            minWidth: '100px',
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

const SystemOfEquationsQuiz = () => {
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
        text: correct ? 'Chính xác! 🚀' : 'Chưa đúng! ❌',
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
    <div style={{
      backgroundColor: '#f8fafc',
      padding: '24px',
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
        background: 'linear-gradient(to right, #e879f9, #a855f7, #6366f1)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#334155' }}>
          📘 Luyện tập - Hệ hai phương trình bậc nhất hai ẩn
        </h3>
        <div style={{
          background: 'linear-gradient(to right, #a855f7, #7c3aed)',
          color: 'white', padding: '6px 16px', borderRadius: '999px',
          fontWeight: 'bold', fontSize: '14px',
          boxShadow: '0 2px 6px rgba(124,58,237,0.4)',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span>🏆</span><span>{totalScore}</span>
        </div>
      </div>

      {/* Grid 2 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
      }}>
        <QuizCard
          problem={problems[0]}
          onAnswer={(choice) => handleAnswer(0, choice)}
          feedback={feedbacks[0]}
          index={0}
        />
        <QuizCard
          problem={problems[1]}
          onAnswer={(choice) => handleAnswer(1, choice)}
          feedback={feedbacks[1]}
          index={1}
        />
      </div>
    </div>
  );
};

export default SystemOfEquationsQuiz;
