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

const LinearEquationQuiz = () => {
  const [mode, setMode] = useState<'identify' | 'solve'>('identify');
  const [problem, setProblem] = useState({ eq: '', x: 0, y: 0, isCorrect: false });
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; type: 'correct' | 'wrong' | null }>({ text: '', type: null });

  const generateProblem = () => {
    setFeedback({ text: '', type: null });
    if (mode === 'identify') {
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
      setProblem({ eq, x: 0, y: 0, isCorrect: isLinear });
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
      setProblem({ eq, x: tx, y: ty, isCorrect });
    }
  };

  useEffect(() => {
    generateProblem();
  }, [mode]);

  const checkAnswer = (userChoice: boolean) => {
    if (userChoice === problem.isCorrect) {
      setScore(s => s + 10);
      setFeedback({ text: 'Chính xác! +10 điểm 🌟', type: 'correct' });
    } else {
      setScore(s => Math.max(0, s - 5));
      setFeedback({ text: 'Sai rồi, hãy thử lại nhé! ❌', type: 'wrong' });
    }
    setTimeout(generateProblem, 2000);
  };

  return (
    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl my-8 text-center max-w-2xl mx-auto font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex bg-slate-200/50 p-1 rounded-full">
          <button 
            onClick={() => setMode('identify')} 
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'identify' ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            🔍 Nhận biết
          </button>
          <button 
            onClick={() => setMode('solve')} 
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'solve' ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ✅ Kiểm tra nghiệm
          </button>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
          <span>🏆 Điểm:</span>
          <span className="text-xl">{score}</span>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm mb-8 border border-slate-100 flex flex-col items-center justify-center min-h-[160px]">
        <div className="text-xl sm:text-2xl font-medium mb-6 text-slate-700 flex flex-col items-center gap-4">
          <span className="text-slate-500 text-sm uppercase tracking-wider font-bold">Phương trình</span>
          <div className="text-3xl text-blue-700 bg-blue-50 px-6 py-3 rounded-xl border border-blue-100">
            <KatexDisplay math={problem.eq} block={true} />
          </div>
        </div>
        <div className="text-lg font-medium text-slate-600">
          {mode === 'identify' 
            ? 'Đây có phải phương trình bậc nhất hai ẩn không?' 
            : <span>Cặp số <span className="font-bold text-blue-600"><KatexDisplay math={`(${problem.x}; ${problem.y})`} /></span> có là nghiệm không?</span>}
        </div>
      </div>

      <div className="flex justify-center gap-4 sm:gap-8 mb-6">
        <button 
          onClick={() => checkAnswer(true)}
          className="flex-1 max-w-[160px] bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 sm:py-4 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_0_rgb(21,128,61)] hover:shadow-[0_2px_0_rgb(21,128,61)] hover:translate-y-[2px]"
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

export default LinearEquationQuiz;
