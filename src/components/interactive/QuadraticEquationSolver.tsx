import React, { useState } from 'react';

export default function QuadraticEquationSolver() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c) || 0;

    if (isNaN(numA) || isNaN(numB)) {
      setResult({ error: "Vui lòng nhập hệ số a và b." });
      return;
    }
    if (numA === 0) {
      setResult({ error: "Hệ số a phải khác 0 đối với phương trình bậc hai." });
      return;
    }

    const delta = numB * numB - 4 * numA * numC;
    let solutions = [];
    let message = '';
    
    // Viète
    const sum = -numB / numA;
    const prod = numC / numA;

    if (delta > 0) {
      const x1 = (-numB + Math.sqrt(delta)) / (2 * numA);
      const x2 = (-numB - Math.sqrt(delta)) / (2 * numA);
      solutions = [x1, x2];
      message = "Phương trình có 2 nghiệm phân biệt";
    } else if (delta === 0) {
      const x = -numB / (2 * numA);
      solutions = [x];
      message = "Phương trình có nghiệm kép";
    } else {
      message = "Phương trình vô nghiệm";
    }

    setResult({
      a: numA, b: numB, c: numC,
      delta, solutions, message, sum, prod
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-indigo-200 shadow-md font-sans max-w-2xl mx-auto my-6">
      <h3 className="text-xl font-bold mb-4 text-indigo-700 border-b pb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a8 8 0 0 1 16 0"/><path d="M12 14v7"/><path d="M9 21h6"/></svg>
        Máy Tính Phương Trình Bậc 2 & Định Lí Viète
      </h3>
      <p className="text-sm text-gray-600 mb-6 italic">Nhập các hệ số a, b, c của phương trình ax² + bx + c = 0 (a ≠ 0).</p>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center bg-indigo-50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <input type="number" value={a} onChange={(e)=>setA(e.target.value)} className="w-16 p-2 text-center border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="a" />
          <span className="font-bold text-lg">x² +</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="number" value={b} onChange={(e)=>setB(e.target.value)} className="w-16 p-2 text-center border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="b" />
          <span className="font-bold text-lg">x +</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="number" value={c} onChange={(e)=>setC(e.target.value)} className="w-16 p-2 text-center border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="c" />
          <span className="font-bold text-lg">= 0</span>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button onClick={calculate} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105">
          Giải Phương Trình
        </button>
      </div>

      {result && result.error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg font-medium text-center">
          {result.error}
        </div>
      )}

      {result && !result.error && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
          <h4 className="font-bold text-slate-800 mb-3 border-b-2 border-indigo-100 pb-2">🎯 Lời Giải Chi Tiết:</h4>
          
          <div className="mb-4">
            <p className="mb-2"><span className="font-semibold text-gray-700">1. Tính Δ (Delta):</span> Δ = b² - 4ac = ({result.b})² - 4·({result.a})·({result.c}) = <b className="text-lg">{result.delta}</b></p>
            
            <p className="mb-2">
              <span className="font-semibold text-gray-700">2. Số nghiệm:</span> Vì Δ {result.delta > 0 ? '> 0' : result.delta === 0 ? '= 0' : '< 0'}, {result.message.toLowerCase()}.
            </p>
            
            {result.solutions.length > 0 && (
              <div className="bg-white p-3 rounded border border-indigo-100 mt-2">
                {result.solutions.length === 2 ? (
                  <ul className="list-disc list-inside text-indigo-900 font-bold text-lg">
                    <li>x₁ = {result.solutions[0].toFixed(4).replace(/\.?0+$/, '')}</li>
                    <li>x₂ = {result.solutions[1].toFixed(4).replace(/\.?0+$/, '')}</li>
                  </ul>
                ) : (
                  <p className="text-indigo-900 font-bold text-lg">x₁ = x₂ = {result.solutions[0].toFixed(4).replace(/\.?0+$/, '')}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200">
             <h5 className="font-bold text-teal-700 mb-2">⭐ Định Lí Viète:</h5>
             {result.delta >= 0 ? (
               <div className="grid grid-cols-2 gap-4 text-sm bg-teal-50 p-3 rounded border border-teal-100">
                 <div>
                   <p className="text-teal-900 font-medium">Tổng S = x₁ + x₂ = -b/a</p>
                   <p className="font-bold text-lg mt-1 text-teal-700">{result.sum.toFixed(4).replace(/\.?0+$/, '')}</p>
                 </div>
                 <div>
                   <p className="text-teal-900 font-medium">Tích P = x₁·x₂ = c/a</p>
                   <p className="font-bold text-lg mt-1 text-teal-700">{result.prod.toFixed(4).replace(/\.?0+$/, '')}</p>
                 </div>
               </div>
             ) : (
               <p className="text-gray-500 italic text-sm">Phương trình vô nghiệm nên không có tổng và tích các nghiệm thực.</p>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
