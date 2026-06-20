import React, { useState } from 'react';

export default function LinearEquationSolver() {
  const [a, setA] = useState<number>(2);
  const [b, setB] = useState<number>(5);
  const [c, setC] = useState<number>(1);
  const [d, setD] = useState<number>(-3);

  const [solution, setSolution] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  const formatTerm = (coef: number, isVar: boolean = false, isFirst: boolean = false) => {
    if (isFirst) {
      if (coef === 0) return '0';
      if (isVar) {
        if (coef === 1) return 'x';
        if (coef === -1) return '-x';
        return `${coef}x`;
      }
      return `${coef}`;
    } else {
      const abs = Math.abs(coef);
      const sign = coef >= 0 ? '+' : '-';
      if (isVar) {
        if (abs === 1) return `${sign} x`;
        return `${sign} ${abs}x`;
      }
      return `${sign} ${abs}`;
    }
  };

  const solveEquation = () => {
    // Step 1: Original Eq
    const leftSide1 = `${formatTerm(a, true, true)} ${formatTerm(b, false, false)}`;
    const rightSide1 = `${formatTerm(c, true, true)} ${formatTerm(d, false, false)}`;
    const step1 = `${leftSide1} = ${rightSide1}`;

    // Step 2: Move x to left, constants to right
    const leftSide2 = `${formatTerm(a, true, true)} ${formatTerm(-c, true, false)}`;
    const rightSide2 = `${formatTerm(d, false, true)} ${formatTerm(-b, false, false)}`;
    const step2 = `${leftSide2} = ${rightSide2}`;

    // Step 3: Simplify
    const xCoef = a - c;
    const constVal = d - b;
    const step3 = `${formatTerm(xCoef, true, true)} = ${constVal}`;

    let step4 = '';
    let res = '';

    if (xCoef === 0) {
      if (constVal === 0) {
        step4 = `0x = 0 (Luôn đúng)`;
        res = 'Phương trình có vô số nghiệm (mọi x ∈ ℝ)';
      } else {
        step4 = `0x = ${constVal} (Vô lý)`;
        res = 'Phương trình vô nghiệm';
      }
      setSteps([step1, step2, step3, step4]);
      setSolution(res);
      return;
    }

    const val = constVal / xCoef;
    if (Number.isInteger(val)) {
        step4 = `x = ${val}`;
        res = `x = ${val}`;
    } else {
        // Simple fraction check or decimal 
        step4 = `x = ${constVal} / ${xCoef}`;
        res = `x = ${val.toFixed(2).replace(/\.00$/, '')}`;
    }
    
    setSteps([step1, step2, step3, step4]);
    setSolution(`Nghiệm của phương trình là: ${res}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-indigo-200 shadow-sm my-6">
      <h4 className="text-xl font-bold text-indigo-800 mb-4 text-center">🧮 Trình giải Phương trình bậc nhất một ẩn</h4>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg flex flex-wrap items-center justify-center gap-2">
          <input type="number" value={a} onChange={e => setA(Number(e.target.value))} className="w-16 p-2 border border-indigo-300 rounded text-center text-lg font-bold" />
          <span className="text-xl font-bold">x +</span>
          <input type="number" value={b} onChange={e => setB(Number(e.target.value))} className="w-16 p-2 border border-indigo-300 rounded text-center text-lg font-bold" />
          
          <span className="text-2xl font-bold mx-2">=</span>
          
          <input type="number" value={c} onChange={e => setC(Number(e.target.value))} className="w-16 p-2 border border-indigo-300 rounded text-center text-lg font-bold" />
          <span className="text-xl font-bold">x +</span>
          <input type="number" value={d} onChange={e => setD(Number(e.target.value))} className="w-16 p-2 border border-indigo-300 rounded text-center text-lg font-bold" />
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button 
          onClick={solveEquation}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-full transition-colors text-lg shadow hover:shadow-lg"
        >
          Giải từng bước
        </button>
      </div>

      {solution && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-4 w-full md:w-3/4 mx-auto transition-all animate-fade-in">
          <h5 className="font-bold text-blue-800 mb-3 text-lg">📝 Các bước giải:</h5>
          <div className="space-y-3 mb-4 font-mono text-base md:text-lg">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-3 items-center bg-white p-2 rounded border border-blue-100">
                <span className="bg-blue-200 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">{index + 1}</span>
                <span>=&gt; {step}</span>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded border-2 border-indigo-200 shadow-sm mt-4">
            <h5 className="font-bold text-indigo-700 mb-2 text-center text-sm uppercase tracking-wider">Kết luận tập nghiệm</h5>
            <p className="text-indigo-900 font-bold text-2xl text-center">{solution}</p>
          </div>
        </div>
      )}
    </div>
  );
}
