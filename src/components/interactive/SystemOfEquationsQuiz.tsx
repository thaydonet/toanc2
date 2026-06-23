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

const SystemOfEquationsQuiz = () => {
  const [mode, setMode] = useState<'identify' | 'solve'>('identify');
  const [problem, setProblem] = useState<{
    a1: number; b1: number; c1: number;
    a2: number; b2: number; c2: number;
    x: number; y: number; isCorrect: boolean;
    eqStr: string; questionText: string;
  }>({
    a1: 0, b1: 0, c1: 0, a2: 0, b2: 0, c2: 0,
    x: 0, y: 0, isCorrect: false, eqStr: '', questionText: ''
  });
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; type: 'correct' | 'wrong' | null }>({ text: '', type: null });

  const generateProblem = () => {
    setFeedback({ text: '', type: null });

    if (mode === 'identify') {
      const isSystem = Math.random() > 0.4;
      if (isSystem) {
        const a1 = Math.floor(Math.random() * 10) - 5 || 1;
        const b1 = Math.floor(Math.random() * 10) - 5 || 1;
        const c1 = Math.floor(Math.random() * 10) - 5;
        const a2 = Math.floor(Math.random() * 10) - 5 || 1;
        const b2 = Math.floor(Math.random() * 10) - 5 || 1;
        const c2 = Math.floor(Math.random() * 10) - 5;
        const eqStr = `\\begin{cases} ${formatLinearEq(a1, b1, c1)} \\\\ ${formatLinearEq(a2, b2, c2)} \\end{cases}`;
        setProblem({
          a1, b1, c1, a2, b2, c2,
          x: 0, y: 0, isCorrect: true,
          eqStr,
          questionText: 'Đây có phải hệ hai phương trình bậc nhất hai ẩn không?'
        });
      } else {
        const variants = [
          `\\begin{cases} x^2 + y = 3 \\\\ 2x - y = 1 \\end{cases}`,
          `x + y = 5`,
          `\\begin{cases} x^3 + y = 2 \\\\ x - y = 1 \\end{cases}`,
          `\\begin{cases} x + y = 3 \\\\ x^2 - y = 1 \\end{cases}`
        ];
        const eqStr = variants[Math.floor(Math.random() * variants.length)];
        setProblem({
          a1: 0, b1: 0, c1: 0, a2: 0, b2: 0, c2: 0,
          x: 0, y: 0, isCorrect: false,
          eqStr,
          questionText: 'Đây có phải hệ hai phương trình bậc nhất hai ẩn không?'
        });
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
      setProblem({
        a1, b1, c1, a2, b2, c2,
        x: tx, y: ty, isCorrect,
        eqStr,
        questionText: `Cặp số (${tx}; ${ty}) có là nghiệm của hệ không?`
      });
    }
  };

  useEffect(() => {
    generateProblem();
  }, [mode]);

  const checkAnswer = (userChoice: boolean) => {
    if (userChoice === problem.isCorrect) {
      setScore(s => s + 10);
      setFeedback({ text: 'Tuyệt vời! +10 điểm 🚀', type: 'correct' });
    } else {
      setScore(s => Math.max(0, s - 5));
      setFeedback({ text: 'Chưa đúng rồi, cố lên! ❌', type: 'wrong' });
    }
    setTimeout(generateProblem, 2000);
  };

  return (
    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl my-8 text-center max-w-2xl mx-auto font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-fuchsia-400 to-purple-600"></div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex bg-slate-200/50 p-1 rounded-full">
          <button
            onClick={() => setMode('identify')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'identify' ? 'bg-white text-purple-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            🔍 Nhận biết
          </button>
          <button
            onClick={() => setMode('solve')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'solve' ? 'bg-white text-purple-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ✅ Kiểm tra nghiệm
          </button>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-5 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
          <span>🏆 Điểm:</span>
          <span className="text-xl">{score}</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm mb-8 border border-slate-100 flex flex-col items-center justify-center min-h-[180px]">
        <div className="text-xl sm:text-2xl font-medium mb-6 text-slate-700 flex flex-col items-center gap-4">
          <span className="text-slate-500 text-sm uppercase tracking-wider font-bold">Hệ phương trình</span>
          <div className="text-3xl text-purple-700 bg-purple-50 px-8 py-4 rounded-xl border border-purple-100">
            <KatexDisplay math={problem.eqStr} block={true} />
          </div>
        </div>
        <div className="text-lg font-medium text-slate-600">
          {mode === 'identify'
            ? 'Đây có phải hệ hai phương trình bậc nhất hai ẩn không?'
            : <span>Cặp số <span className="font-bold text-purple-600"><KatexDisplay math={`(${problem.x}; ${problem.y})`} /></span> có là nghiệm không?</span>}
        </div>
      </div>

      <div className="flex justify-center gap-4 sm:gap-8 mb-6">
        <button
          onClick={() => checkAnswer(true)}
          className="flex-1 max-w-[160px] bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 sm:py-4 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_0_rgb(5,150,105)] hover:shadow-[0_2px_0_rgb(5,150,105)] hover:translate-y-[2px]"
        >
          Đúng
        </button>
        <button
          onClick={() => checkAnswer(false)}
          className="flex-1 max-w-[160px] bg-gradient-to-b from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-3 sm:py-4 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_0_rgb(190,18,60)] hover:shadow-[0_2px_0_rgb(190,18,60)] hover:translate-y-[2px]"
        >
          Sai
        </button>
      </div>

      <div className="h-12 flex items-center justify-center">
        {feedback.text && (
          <div className={`font-bold text-lg px-6 py-2 rounded-full animate-bounce ${feedback.type === 'correct' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemOfEquationsQuiz;
