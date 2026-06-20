import React, { useState } from 'react';

export default function LinearFunctionGrapher() {
  const [a, setA] = useState<number>(2);
  const [b, setB] = useState<number>(1);

  // SVG Configuration
  const minX = -10;
  const maxX = 10;
  const minY = -10;
  const maxY = 10;
  
  // Calculate points for the line y = ax + b
  // We just need two points that extend beyond the view boundary
  const x1 = minX;
  const y1 = a * x1 + b;
  const x2 = maxX;
  const y2 = a * x2 + b;

  // Formatting for the equation display
  const formatEquation = () => {
    let eq = 'y = ';
    if (a !== 0) {
      if (a === 1) eq += 'x';
      else if (a === -1) eq += '-x';
      else eq += `${a}x`;
    }
    
    if (b !== 0) {
      if (a === 0) {
        eq += `${b}`;
      } else {
        eq += b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`;
      }
    } else if (a === 0) {
      eq += '0';
    }
    return eq;
  };

  // Generate grid lines
  const gridLines = [];
  for (let i = minX; i <= maxX; i++) {
     // vertical
     gridLines.push(<line key={`v${i}`} x1={i} y1={minY} x2={i} y2={maxY} stroke="#cbd5e1" strokeWidth={i === 0 ? 0 : 0.05} />);
     // horizontal
     gridLines.push(<line key={`h${i}`} x1={minX} y1={i} x2={maxX} y2={i} stroke="#cbd5e1" strokeWidth={i === 0 ? 0 : 0.05} />);
  }

  // Roots & Intercepts (for marking crucial points)
  const yIntercept = b;
  const xIntercept = a !== 0 ? -b / a : null;

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm my-6 font-sans">
      <h4 className="text-xl font-bold text-slate-800 mb-4 text-center">📈 Đồ thị Hàm số Bậc nhất (SVG Inline)</h4>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Controls */}
        <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col gap-6">
          <div className="text-center bg-blue-100 p-3 rounded-lg border-2 border-blue-200 shadow-inner">
            <span className="text-2xl font-bold text-blue-800 italic">{formatEquation()}</span>
          </div>

          <div>
            <label className="flex justify-between font-bold text-slate-700 mb-2">
              <span>Hệ số góc <em className="text-blue-600">a</em></span>
              <span className="text-blue-600 bg-blue-100 px-2 rounded">{a}</span>
            </label>
            <input 
              type="range" 
              min="-5" max="5" step="0.5" 
              value={a} 
              onChange={e => setA(Number(e.target.value))} 
              className="w-full accent-blue-600"
            />
            <p className="text-xs text-slate-500 mt-1">
              {a > 0 ? 'Hàm số đồng biến (đồ thị đi lên)' : a < 0 ? 'Hàm số nghịch biến (đồ thị đi xuống)' : 'Đường thẳng song song với Ox'}
            </p>
          </div>

          <div>
            <label className="flex justify-between font-bold text-slate-700 mb-2">
              <span>Tung độ gốc <em className="text-orange-600">b</em></span>
              <span className="text-orange-600 bg-orange-100 px-2 rounded">{b}</span>
            </label>
            <input 
              type="range" 
              min="-8" max="8" step="0.5" 
              value={b} 
              onChange={e => setB(Number(e.target.value))} 
              className="w-full accent-orange-600"
            />
            <p className="text-xs text-slate-500 mt-1">Điểm cắt trục tung Oy tại (0 ; {b})</p>
          </div>

          <div className="text-sm text-slate-700 bg-white p-3 rounded border border-slate-200">
            <h5 className="font-bold mb-2">📍 Tọa độ giao điểm:</h5>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cắt <strong className="text-orange-600">Oy</strong> tại: <span className="font-mono bg-slate-100 px-1 rounded">(0, {b})</span></li>
              {xIntercept !== null && (
                <li>Cắt <strong className="text-teal-600">Ox</strong> tại: <span className="font-mono bg-slate-100 px-1 rounded">({Number.isInteger(xIntercept) ? xIntercept : xIntercept.toFixed(2)}, 0)</span></li>
              )}
            </ul>
          </div>
        </div>

        {/* Graph SVG */}
        <div className="w-full lg:w-2/3 flex justify-center bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <svg 
            viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} 
            className="w-full h-auto max-h-[500px]"
            style={{ display: 'block' }}
          >
            {/* SVG coordinate system makes Y go down by default. We flip it so Y goes up! */}
            <g transform="scale(1, -1)">
              
              {/* Background */}
              <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} fill="#f8fafc" />
              
              {/* Grid Lines */}
              {gridLines}

              {/* Axes */}
              <line x1={minX} y1={0} x2={maxX} y2={0} stroke="#475569" strokeWidth="0.15" /> {/* X Axis */}
              <line x1={0} y1={minY} x2={0} y2={maxY} stroke="#475569" strokeWidth="0.15" /> {/* Y Axis */}
              
              {/* Arrows for Axes */}
              <polygon points={`${maxX},0 ${maxX-0.4},0.2 ${maxX-0.4},-0.2`} fill="#475569" />
              <polygon points={`0,${maxY} 0.2,${maxY-0.4} -0.2,${maxY-0.4}`} fill="#475569" />

              {/* Ticks and Labels (Need to unflip text by scaling Y back) */}
              {Array.from({length: maxX - minX + 1}).map((_, idx) => {
                const i = minX + idx;
                if (i === 0) return null;
                return (
                  <g key={`ticks-${i}`}>
                    {/* Tick marks */}
                    <line x1={i} y1={-0.1} x2={i} y2={0.1} stroke="#475569" strokeWidth="0.1" />
                    <line x1={-0.1} y1={i} x2={0.1} y2={i} stroke="#475569" strokeWidth="0.1" />
                    
                    {/* X-axis labels */}
                    <text x={i} y={0.6} fontSize="0.5" fill="#64748b" textAnchor="middle" transform={`scale(1, -1) translate(0, 0)`}>{i}</text>
                    
                    {/* Y-axis labels */}
                    <text x={-0.4} y={-i + 0.15} fontSize="0.5" fill="#64748b" textAnchor="end" transform={`scale(1, -1) translate(0, 0)`}>{i}</text>
                  </g>
                )
              })}
              
              {/* Axis Names */}
              <text x={maxX - 0.5} y={0.6} fontSize="0.6" fontStyle="italic" fill="#0f172a" transform="scale(1, -1)">x</text>
              <text x={-0.5} y={-maxY + 0.6} fontSize="0.6" fontStyle="italic" fill="#0f172a" transform="scale(1, -1)">y</text>

              {/* Origin O */}
              <text x={-0.4} y={0.6} fontSize="0.6" fontStyle="italic" fill="#0f172a" transform="scale(1, -1)">O</text>

              {/* The Function Line */}
              <path 
                d={`M ${x1} ${y1} L ${x2} ${y2}`} 
                stroke="#2563eb" 
                strokeWidth="0.2"
                fill="none"
              />

              {/* Mark Y Intercept (0, b) */}
              <circle cx={0} cy={yIntercept} r="0.25" fill="#ea580c" />
              
              {/* Mark X Intercept (-b/a, 0) */}
              {xIntercept !== null && (
                 <circle cx={xIntercept} cy={0} r="0.25" fill="#0d9488" />
              )}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
