import React, { useState } from 'react';

export default function CircleCalculator() {
  const [inputs, setInputs] = useState({ r: '', d: '', c: '', s: '', n: '' });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    setError('');
    let r = parseFloat(inputs.r);
    let d = parseFloat(inputs.d);
    let c = parseFloat(inputs.c);
    let s = parseFloat(inputs.s);
    let n = parseFloat(inputs.n);

    let knowns = 0;
    if (!isNaN(r)) knowns++;
    if (!isNaN(d)) knowns++;
    if (!isNaN(c)) knowns++;
    if (!isNaN(s)) knowns++;

    if (knowns === 0) {
      setError('Vui lòng nhập ít nhất 1 thông số của đường tròn (Bán kính, Đường kính, Chu vi, hoặc Diện tích).');
      return;
    }

    try {
      if (!isNaN(r)) {
      } else if (!isNaN(d)) {
        r = d / 2;
      } else if (!isNaN(c)) {
        r = c / (2 * Math.PI);
      } else if (!isNaN(s)) {
        r = Math.sqrt(s / Math.PI);
      }

      if (r <= 0) throw new Error("Kích thước hình tròn phải là số dương.");

      d = 2 * r;
      c = 2 * Math.PI * r;
      s = Math.PI * r * r;

      let arcLength = null;
      let sectorArea = null;

      if (!isNaN(n)) {
        if (n <= 0 || n > 360) throw new Error("Góc ở tâm (độ) phải lớn hơn 0 và nhỏ hơn hoặc bằng 360.");
        arcLength = (Math.PI * r * n) / 180;
        sectorArea = (Math.PI * r * r * n) / 360;
      }

      setResult({
        r: r.toFixed(2),
        d: d.toFixed(2),
        c: c.toFixed(2),
        s: s.toFixed(2),
        n: !isNaN(n) ? n.toFixed(1) : null,
        arcLength: arcLength ? arcLength.toFixed(2) : null,
        sectorArea: sectorArea ? sectorArea.toFixed(2) : null,
      });
    } catch (err: any) {
      setError(err.message || 'Dữ liệu không hợp lệ.');
    }
  };

  const clear = () => {
    setInputs({ r: '', d: '', c: '', s: '', n: '' });
    setResult(null);
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-md font-sans max-w-2xl mx-auto my-6">
      <h3 className="text-xl font-bold mb-4 text-blue-700 border-b pb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="12" x2="16" y2="16"></line><line x1="12" y1="12" x2="12" y2="2"></line></svg>
        Máy Tính Bán Kính & Cung Tròn
      </h3>
      <p className="text-sm text-gray-600 mb-6 italic">Nhập 1 thông số khung (R, d, C, S) máy sẽ tự nội suy các cạnh còn lại. Nhập thêm \"Góc ở tâm n°\" nếu muốn tính Cung và Quạt.</p>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* SVG Circle representation */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
           <svg width="180" height="180" viewBox="0 0 200 200">
             <circle cx="100" cy="100" r="80" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="4" />
             <circle cx="100" cy="100" r="4" fill="#1e3a8a" />
             {/* Radius Line */}
             <line x1="100" y1="100" x2="180" y2="100" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="4 4" />
             <text x="130" y="95" fill="#1e3a8a" fontSize="14" fontWeight="bold">R</text>
             {/* If n is entered, draw sector */}
             {inputs.n && !isNaN(parseFloat(inputs.n)) && parseFloat(inputs.n) <= 360 && (
               <>
                 <path 
                   d={`M 100,100 L 180,100 A 80,80 0 ${parseFloat(inputs.n) > 180 ? 1 : 0},1 ${100 + 80 * Math.cos((parseFloat(inputs.n) * Math.PI) / 180)},${100 - 80 * Math.sin((parseFloat(inputs.n) * Math.PI) / 180)} Z`} 
                   fill="#bfdbfe" opacity="0.7" stroke="#2563eb" strokeWidth="2" 
                 />
                 <text x="110" y="85" fill="#0369a1" fontSize="12" fontWeight="bold">n°</text>
               </>
             )}
           </svg>
        </div>

        {/* Inputs */}
        <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800">Bán kính (R)</label>
            <input type="number" name="r" value={inputs.r} onChange={handleChange} className="w-full p-2 border border-blue-200 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition" placeholder="Ví dụ: 5"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800">Đường kính (d)</label>
            <input type="number" name="d" value={inputs.d} onChange={handleChange} className="w-full p-2 border border-blue-200 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition" placeholder="Ví dụ: 10"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-green-700">Chu vi (C)</label>
            <input type="number" name="c" value={inputs.c} onChange={handleChange} className="w-full p-2 border border-green-200 rounded shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition" placeholder="C = 2πR"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-green-700">Diện tích (S)</label>
            <input type="number" name="s" value={inputs.s} onChange={handleChange} className="w-full p-2 border border-green-200 rounded shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition" placeholder="S = πR²"/>
          </div>
          <div className="col-span-2 border-t pt-3 mt-1">
            <label className="block text-sm font-semibold mb-1 text-orange-600">Góc ở tâm n° (Tuỳ chọn)</label>
            <input type="number" name="n" value={inputs.n} onChange={handleChange} className="w-full p-2 border border-orange-200 rounded shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition" placeholder="Nhập góc n (0-360) để tính Toán cung" min="0" max="360"/>
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-3">
            <button onClick={clear} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition">Làm lại</button>
            <button onClick={calculate} className="px-5 py-2 bg-blue-600 text-white font-bold rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition">Phân Tích</button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded text-sm font-medium">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="mt-6 p-5 bg-sky-50 border border-sky-200 rounded-lg">
          <h4 className="font-bold text-sky-900 mb-3 block border-b border-sky-200 pb-2">🎯 Kết quả tính toán (Lấy π ≈ 3.14159...):</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 mb-4 text-sm bg-white p-4 rounded shadow-inner">
            <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold uppercase">Bán kính (R)</span>
                <span className="text-blue-700 font-mono font-bold text-lg">{result.r}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold uppercase">Đường kính (d)</span>
                <span className="text-blue-700 font-mono font-bold text-lg">{result.d}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold uppercase">Chu vi (C)</span>
                <span className="text-green-700 font-mono font-bold text-lg">{result.c}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold uppercase">Diện tích (S)</span>
                <span className="text-green-700 font-mono font-bold text-lg">{result.s}</span>
            </div>
          </div>

          {result.n && (
            <div className="grid grid-cols-2 gap-4 mt-4 bg-orange-50 border border-orange-100 p-4 rounded-lg">
                <div className="flex flex-col">
                    <span className="text-orange-800 text-xs font-semibold uppercase mb-1">Độ dài cung tròn l ({result.n}°)</span>
                    <span className="text-orange-600 font-mono font-bold text-xl">{result.arcLength}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-orange-800 text-xs font-semibold uppercase mb-1">Diện tích quạt tròn Sq ({result.n}°)</span>
                    <span className="text-orange-600 font-mono font-bold text-xl">{result.sectorArea}</span>
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
