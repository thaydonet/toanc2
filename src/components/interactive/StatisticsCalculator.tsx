import React, { useState, useMemo } from 'react';

export default function StatisticsCalculator() {
  const [inputData, setInputData] = useState('5, 6, 6, 7, 7, 7, 8, 8, 9, 10');
  const [error, setError] = useState('');

  const stats = useMemo(() => {
    try {
      const numbers = inputData
        .split(/[,\s]+/)
        .filter(val => val.trim() !== '')
        .map(val => {
          const num = parseFloat(val);
          if (isNaN(num)) throw new Error(`"${val}" không phải là số hợp lệ.`);
          return num;
        });

      if (numbers.length === 0) {
        return null;
      }

      numbers.sort((a, b) => a - b);
      const N = numbers.length;

      const freqMap = new Map<number, number>();
      numbers.forEach(n => {
        freqMap.set(n, (freqMap.get(n) || 0) + 1);
      });

      const uniqueValues = Array.from(freqMap.keys()).sort((a, b) => a - b);
      
      let sum = 0;
      const distribution = uniqueValues.map(val => {
        const freq = freqMap.get(val)!;
        const relFreq = (freq / N) * 100;
        sum += val * freq;
        return { value: val, freq, relFreq };
      });

      const mean = sum / N;

      setError('');
      return {
        totalData: N,
        mean,
        distribution
      };

    } catch (err: any) {
      setError(err.message || 'Lỗi xử lý dữ liệu');
      return null;
    }
  }, [inputData]);

  return (
    <div className="bg-white p-6 rounded-xl border border-teal-200 shadow-md font-sans max-w-3xl mx-auto my-6">
      <h3 className="text-xl font-bold mb-4 text-teal-700 border-b pb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
        Máy Tính Thống Kê & Tần Số
      </h3>
      <p className="text-sm text-gray-600 mb-4 italic">Nhập dãy số liệu thống kê, cách nhau bởi dấu phẩy hoặc khoảng trắng.</p>
      
      <div className="mb-6">
        <textarea 
          value={inputData} 
          onChange={(e)=>setInputData(e.target.value)} 
          className="w-full p-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" 
          rows={3}
          placeholder="Ví dụ: 7, 8, 8, 9, 10"
        />
      </div>

      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg font-medium text-center">
          {error}
        </div>
      ) : stats ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
          <div className="flex gap-6 mb-6 pb-4 border-b border-teal-100">
            <div>
              <p className="text-teal-900 font-medium text-sm">Cỡ Mẫu (N)</p>
              <p className="font-bold text-2xl text-teal-700">{stats.totalData}</p>
            </div>
            <div>
              <p className="text-teal-900 font-medium text-sm">Số Trung Bình (x̄)</p>
              <p className="font-bold text-2xl text-teal-700">{stats.mean.toFixed(2).replace(/\.?0+$/, '')}</p>
            </div>
          </div>
          
          <h4 className="font-bold text-slate-800 mb-3">Bảng Phân Bố Tần Số & Tần Số Tương Đối:</h4>
          
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full text-center text-sm">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-4 py-2 font-semibold">Giá trị (x)</th>
                  <th className="px-4 py-2 font-semibold">Tần số (n)</th>
                  <th className="px-4 py-2 font-semibold">Tần số tương đối (f)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.distribution.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2 font-bold text-slate-700">{item.value}</td>
                    <td className="px-4 py-2 text-indigo-700 font-medium">{item.freq}</td>
                    <td className="px-4 py-2 text-teal-700 font-medium">{item.relFreq.toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="bg-teal-50 font-bold border-t-2 border-teal-200">
                  <td className="px-4 py-3 text-teal-900">Tổng Vị Trí</td>
                  <td className="px-4 py-3 text-indigo-800">N = {stats.totalData}</td>
                  <td className="px-4 py-3 text-teal-800">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
