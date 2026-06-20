import React, { useState } from 'react';

export default function ProbabilitySimulator() {
  const [mode, setMode] = useState<'coin' | 'dice'>('dice');
  const [numTrials, setNumTrials] = useState<number>(10);
  const [results, setResults] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSimulate = () => {
    setIsAnimating(true);
    setResults([]);
    
    setTimeout(() => {
      const newResults = [];
      const trials = Math.min(Math.max(numTrials, 1), 10000); // limit to 1-10000
      
      for (let i = 0; i < trials; i++) {
        if (mode === 'coin') {
          newResults.push(Math.random() < 0.5 ? 0 : 1); // 0 = Sấp, 1 = Ngửa
        } else {
          newResults.push(Math.floor(Math.random() * 6) + 1); // 1 to 6
        }
      }
      setResults(newResults);
      setIsAnimating(false);
    }, 600);
  };

  // Calculate frequencies
  const freqMap = new Map<number, number>();
  results.forEach(r => freqMap.set(r, (freqMap.get(r) || 0) + 1));

  const total = results.length;

  return (
    <div className="bg-white p-6 rounded-xl border border-indigo-200 shadow-md font-sans max-w-2xl mx-auto my-6">
      <h3 className="text-xl font-bold mb-4 text-indigo-700 border-b pb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/><circle cx="8.5" cy="15.5" r="1.5"/><circle cx="12" cy="12" r="1.5"/></svg>
        Máy Mô Phỏng Phép Thử Ngẫu Nhiên
      </h3>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1 space-y-3">
          <label className="block text-sm font-bold text-gray-700">Chọn Phép thử:</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setMode('coin')}
              className={`flex-1 py-2 rounded-lg font-medium border ${mode === 'coin' ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
            >
              🪙 Tung Đồng Xu
            </button>
            <button 
              onClick={() => setMode('dice')}
              className={`flex-1 py-2 rounded-lg font-medium border ${mode === 'dice' ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
            >
              🎲 Gieo Xúc Xắc
            </button>
          </div>
        </div>
        
        <div className="flex-1 space-y-3">
          <label className="block text-sm font-bold text-gray-700">Số Lần Thực Hiện (N):</label>
          <div className="flex gap-2 items-center">
            <input 
              type="number" 
              value={numTrials} 
              onChange={e => setNumTrials(parseInt(e.target.value) || 0)}
              className="w-24 p-2 text-center border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
              min="1" max="10000"
            />
            <button 
              onClick={handleSimulate}
              disabled={isAnimating}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow disabled:opacity-50"
            >
              {isAnimating ? 'Đang tung...' : 'Tiến Hành'}
            </button>
          </div>
        </div>
      </div>

      {total > 0 && !isAnimating && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 animate-fade-in">
          <h4 className="font-bold text-slate-800 mb-3 border-b-2 border-indigo-100 pb-2">📊 Kết Quả Thống Kê (N = {total}):</h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
             {mode === 'coin' ? (
                <>
                  <StatCard label="Mặt Sấp (S)" freq={freqMap.get(0) || 0} total={total} />
                  <StatCard label="Mặt Ngửa (N)" freq={freqMap.get(1) || 0} total={total} />
                </>
             ) : (
                <>
                  {[1, 2, 3, 4, 5, 6].map(face => (
                    <StatCard key={face} label={`Mặt ${face} chấm`} freq={freqMap.get(face) || 0} total={total} />
                  ))}
                </>
             )}
          </div>
          
          <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-100 italic">
            <strong>* Không gian Mẫu ($\Omega$):</strong> {mode === 'coin' ? '{Sấp, Ngửa}' : '{1, 2, 3, 4, 5, 6}'}<br/>
            <strong>* Quy luật Số Lớn:</strong> Khi số lần tung (N) càng lớn, Tần số tương đối sẽ càng tiến sát về xác suất lý thuyết ({mode === 'coin' ? '50%' : '16.67%'}). Hãy thử tung 10,000 lần để kiểm chứng!
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, freq, total }: { label: string, freq: number, total: number }) {
  const relFreq = total > 0 ? ((freq / total) * 100).toFixed(1) : '0.0';
  
  return (
    <div className="bg-white border border-indigo-100 rounded-lg p-3 text-center shadow-sm">
      <div className="font-semibold text-gray-700 text-sm mb-1">{label}</div>
      <div className="text-2xl font-bold text-indigo-700">{freq}</div>
      <div className="text-xs text-slate-500 font-medium">{relFreq}%</div>
    </div>
  );
}
