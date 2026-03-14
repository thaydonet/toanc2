import React, { useState } from 'react';

export default function SystemOfEquationsSolver() {
  const [a1, setA1] = useState<number>(2);
  const [b1, setB1] = useState<number>(1);
  const [c1, setC1] = useState<number>(5);
  const [a2, setA2] = useState<number>(1);
  const [b2, setB2] = useState<number>(-1);
  const [c2, setC2] = useState<number>(1);

  const [solution, setSolution] = useState<string | null>(null);

  const solveSystem = () => {
    const D = a1 * b2 - a2 * b1;
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;

    if (D === 0) {
      if (Dx === 0 && Dy === 0) {
        setSolution("Hệ phương trình có vô số nghiệm.");
      } else {
        setSolution("Hệ phương trình vô nghiệm.");
      }
    } else {
      const x = Dx / D;
      const y = Dy / D;
      setSolution(`Hệ có nghiệm duy nhất: x = ${x.toFixed(2).replace(/\.00$/, '')}, y = ${y.toFixed(2).replace(/\.00$/, '')}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-sm my-6">
      <h4 className="text-xl font-bold text-blue-800 mb-4 text-center">🧮 Trình giải hệ phương trình bậc nhất hai ẩn</h4>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <input type="number" value={a1} onChange={e => setA1(Number(e.target.value))} className="w-16 p-1 border rounded text-center" />
            <span>x +</span>
            <input type="number" value={b1} onChange={e => setB1(Number(e.target.value))} className="w-16 p-1 border rounded text-center" />
            <span>y =</span>
            <input type="number" value={c1} onChange={e => setC1(Number(e.target.value))} className="w-16 p-1 border rounded text-center" />
          </div>
          <div className="flex items-center gap-2">
            <input type="number" value={a2} onChange={e => setA2(Number(e.target.value))} className="w-16 p-1 border rounded text-center" />
            <span>x +</span>
            <input type="number" value={b2} onChange={e => setB2(Number(e.target.value))} className="w-16 p-1 border rounded text-center" />
            <span>y =</span>
            <input type="number" value={c2} onChange={e => setC2(Number(e.target.value))} className="w-16 p-1 border rounded text-center" />
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button 
          onClick={solveSystem}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
        >
          Giải hệ phương trình
        </button>
      </div>

      {solution && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mt-4">
          <h5 className="font-bold text-green-800 mb-1">Kết quả:</h5>
          <p className="text-green-900 font-medium text-lg">{solution}</p>
        </div>
      )}
    </div>
  );
}
