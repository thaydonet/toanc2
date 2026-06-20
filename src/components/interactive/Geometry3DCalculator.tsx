import React, { useState } from 'react';

export default function Geometry3DCalculator() {
  const [shape, setShape] = useState<'cylinder' | 'cone' | 'sphere'>('cylinder');
  const [radius, setRadius] = useState<number>(5);
  const [height, setHeight] = useState<number>(10);

  const R = Math.max(0, radius);
  const h = Math.max(0, height);
  const PI = Math.PI;

  // Tính toán
  let l = 0; // Đường sinh (cho nón)
  let sxq = 0; // Diện tích xung quanh
  let stp = 0; // Diện tích toàn phần
  let v = 0; // Thể tích

  if (shape === 'cylinder') {
    sxq = 2 * PI * R * h;
    stp = sxq + 2 * PI * R * R;
    v = PI * R * R * h;
  } else if (shape === 'cone') {
    l = Math.sqrt(R * R + h * h);
    sxq = PI * R * l;
    stp = sxq + PI * R * R;
    v = (1 / 3) * PI * R * R * h;
  } else if (shape === 'sphere') {
    sxq = 4 * PI * R * R; // Mặt cầu
    stp = sxq;
    v = (4 / 3) * PI * R * R * R;
  }

  const formatNumber = (num: number) => num.toFixed(2).replace(/\.?0+$/, '');

  return (
    <div className="bg-white p-6 rounded-xl border border-sky-200 shadow-md font-sans max-w-2xl mx-auto my-6">
      <h3 className="text-xl font-bold mb-4 text-sky-700 border-b pb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        Máy Tính Không Gian 3D (Trụ - Nón - Cầu)
      </h3>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setShape('cylinder')}
          className={`flex-1 py-2 rounded-lg font-medium border ${shape === 'cylinder' ? 'bg-sky-100 border-sky-500 text-sky-800' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
        >
          🛢️ Hình Trụ
        </button>
        <button 
          onClick={() => setShape('cone')}
          className={`flex-1 py-2 rounded-lg font-medium border ${shape === 'cone' ? 'bg-sky-100 border-sky-500 text-sky-800' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
        >
           Hình Nón
        </button>
        <button 
          onClick={() => setShape('sphere')}
          className={`flex-1 py-2 rounded-lg font-medium border ${shape === 'sphere' ? 'bg-sky-100 border-sky-500 text-sky-800' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
        >
          ⚽ Hình Cầu
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Bán kính đáy (R):</label>
          <input 
            type="number" 
            value={radius} 
            onChange={e => setRadius(parseFloat(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded focus:border-sky-500 focus:outline-none"
            min="0"
          />
        </div>
        {shape !== 'sphere' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Chiều cao (h):</label>
            <input 
              type="number" 
              value={height} 
              onChange={e => setHeight(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded focus:border-sky-500 focus:outline-none"
              min="0"
            />
          </div>
        )}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <h4 className="font-bold text-slate-800 mb-3 border-b-2 border-sky-100 pb-2">📊 Kết Quả Tính Toán:</h4>
        
        <div className="space-y-3">
          {shape === 'cone' && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Đường sinh (l):</span>
              <span className="font-bold text-sky-700">{formatNumber(l)}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">{shape === 'sphere' ? 'Diện tích mặt cầu (S):' : 'Diện tích xung quanh (S_xq):'}</span>
            <span className="font-bold text-sky-700">{formatNumber(sxq)} (≈ {formatNumber(sxq/PI)}π)</span>
          </div>
          {shape !== 'sphere' && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Diện tích toàn phần (S_tp):</span>
              <span className="font-bold text-indigo-700">{formatNumber(stp)} (≈ {formatNumber(stp/PI)}π)</span>
            </div>
          )}
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 font-medium">Thể tích (V):</span>
            <span className="font-bold text-rose-600 text-lg">{formatNumber(v)} (≈ {formatNumber(v/PI)}π)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
