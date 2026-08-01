import { useState } from 'react';

export default function ThuTuSoInteractive() {
  const [tab, setTab] = useState<'soSanh' | 'sapXep' | 'demSo' | 'trucSo'>('soSanh');

  // Tab 1: So sánh hai số
  const [numA, setNumA] = useState<number>(456);
  const [numB, setNumB] = useState<number>(465);
  const [compareResult, setCompareResult] = useState<string>('');

  const handleCompare = () => {
    if (numA < numB) setCompareResult(`${numA} < ${numB} (nhỏ hơn)`);
    else if (numA > numB) setCompareResult(`${numA} > ${numB} (lớn hơn)`);
    else setCompareResult(`${numA} = ${numB} (bằng nhau)`);
  };

  // Tab 2: Sắp xếp
  const [sortInput, setSortInput] = useState<string>('78, 125, 45, 230, 12, 99');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortResult, setSortResult] = useState<number[]>([]);

  const handleSort = () => {
    const nums = sortInput.split(/[,;\s]+/).map(Number).filter(n => !isNaN(n) && n >= 0);
    const sorted = [...nums].sort((a, b) => sortOrder === 'asc' ? a - b : b - a);
    setSortResult(sorted);
  };

  // Tab 3: Đếm số
  const [countA, setCountA] = useState<number>(10);
  const [countB, setCountB] = useState<number>(25);
  const [countResult, setCountResult] = useState<{ fromTo: number; between: number } | null>(null);

  const handleCount = () => {
    const min = Math.min(countA, countB);
    const max = Math.max(countA, countB);
    setCountResult({
      fromTo: max - min + 1,
      between: Math.max(0, max - min - 1)
    });
  };

  // Tab 4: Trục số tương tác
  const [highlightA, setHighlightA] = useState<number>(3);
  const [highlightB, setHighlightB] = useState<number>(7);

  return (
    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.25rem' }}>📊</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Thứ tự số tự nhiên
        </h3>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { key: 'soSanh', label: '1. So sánh hai số' },
          { key: 'sapXep', label: '2. Sắp xếp' },
          { key: 'demSo', label: '3. Đếm số' },
          { key: 'trucSo', label: '4. Trục số' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: tab === t.key ? '#2563eb' : '#f1f5f9',
              color: tab === t.key ? '#ffffff' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: So sánh */}
      {tab === 'soSanh' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>Nhập hai số để so sánh:</p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <input
              type="number"
              value={numA}
              onChange={(e) => { setNumA(Number(e.target.value)); setCompareResult(''); }}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #93c5fd', fontSize: '1.1rem', fontWeight: 600, width: '120px' }}
            />
            <select style={{ padding: '0.5rem', borderRadius: '8px', border: '2px solid #c4b5fd', fontSize: '1.2rem', fontWeight: 700, color: '#6366f1' }}>
              <option>vs</option>
            </select>
            <input
              type="number"
              value={numB}
              onChange={(e) => { setNumB(Number(e.target.value)); setCompareResult(''); }}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #93c5fd', fontSize: '1.1rem', fontWeight: 600, width: '120px' }}
            />
            <button
              onClick={handleCompare}
              style={{ padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              So sánh
            </button>
          </div>

          {compareResult && (
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1e40af', textAlign: 'center' }}>
                {numA.toLocaleString('vi-VN')} {numA < numB ? '<' : numA > numB ? '>' : '='} {numB.toLocaleString('vi-VN')}
              </p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#475569', textAlign: 'center' }}>
                {numA < numB
                  ? `${numA.toLocaleString('vi-VN')} nhỏ hơn ${numB.toLocaleString('vi-VN')}`
                  : numA > numB
                    ? `${numA.toLocaleString('vi-VN')} lớn hơn ${numB.toLocaleString('vi-VN')}`
                    : 'Hai số bằng nhau'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sắp xếp */}
      {tab === 'sapXep' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 0.75rem 0', fontWeight: 600, color: '#334155' }}>
            Nhập dãy số (phân cách bằng dấu phẩy hoặc khoảng trắng):
          </p>
          <input
            type="text"
            value={sortInput}
            onChange={(e) => { setSortInput(e.target.value); setSortResult([]); }}
            style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #93c5fd', fontSize: '1rem', fontWeight: 500, boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '1rem 0', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSortOrder('asc')}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', backgroundColor: sortOrder === 'asc' ? '#10b981' : '#e2e8f0', color: sortOrder === 'asc' ? '#fff' : '#475569' }}
            >
              Tăng dần ↑
            </button>
            <button
              onClick={() => setSortOrder('desc')}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', backgroundColor: sortOrder === 'desc' ? '#ef4444' : '#e2e8f0', color: sortOrder === 'desc' ? '#fff' : '#475569' }}
            >
              Giảm dần ↓
            </button>
            <button
              onClick={handleSort}
              style={{ padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Sắp xếp
            </button>
          </div>

          {sortResult.length > 0 && (
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: '#1e293b' }}>Kết quả:</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {sortResult.map((num, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-block',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      backgroundColor: idx === 0 ? '#dcfce7' : idx === sortResult.length - 1 ? '#fee2e2' : '#eff6ff',
                      color: idx === 0 ? '#166534' : idx === sortResult.length - 1 ? '#991b1b' : '#1d4ed8',
                      border: `1px solid ${idx === 0 ? '#86efac' : idx === sortResult.length - 1 ? '#fca5a5' : '#bfdbfe'}`,
                    }}
                  >
                    {num.toLocaleString('vi-VN')}
                    {idx === 0 && <span style={{ fontSize: '0.7rem', marginLeft: '4px' }}>nhỏ nhất</span>}
                    {idx === sortResult.length - 1 && sortResult.length > 1 && <span style={{ fontSize: '0.7rem', marginLeft: '4px' }}>lớn nhất</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Đếm số */}
      {tab === 'demSo' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>Tìm số các số tự nhiên:</p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: 500, color: '#475569' }}>Từ:</label>
            <input
              type="number"
              value={countA}
              onChange={(e) => { setCountA(Number(e.target.value)); setCountResult(null); }}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #93c5fd', fontSize: '1.1rem', fontWeight: 600, width: '100px' }}
            />
            <label style={{ fontWeight: 500, color: '#475569' }}>đến:</label>
            <input
              type="number"
              value={countB}
              onChange={(e) => { setCountB(Number(e.target.value)); setCountResult(null); }}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #93c5fd', fontSize: '1.1rem', fontWeight: 600, width: '100px' }}
            />
            <button
              onClick={handleCount}
              style={{ padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Đếm
            </button>
          </div>

          {countResult && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#f0f9ff', borderLeft: '4px solid #0284c7', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#0369a1' }}>Từ {Math.min(countA, countB)} đến {Math.max(countA, countB)}</p>
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#0284c7' }}>{countResult.fromTo} số</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>Công thức: {Math.max(countA, countB)} - {Math.min(countA, countB)} + 1 = {countResult.fromTo}</p>
              </div>
              <div style={{ background: '#fff7ed', borderLeft: '4px solid #ea580c', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#c2410c' }}>Nằm giữa (không kể {Math.min(countA, countB)} và {Math.max(countA, countB)})</p>
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#ea580c' }}>{countResult.between} số</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>Công thức: {Math.max(countA, countB)} - {Math.min(countA, countB)} - 1 = {countResult.between}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Trục số */}
      {tab === 'trucSo' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Chọn hai số trên trục số (nhập từ 0 đến 10):
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: 500, color: '#475569' }}>Số A:</label>
            <input
              type="number"
              min={0}
              max={10}
              value={highlightA}
              onChange={(e) => setHighlightA(Math.min(10, Math.max(0, Number(e.target.value))))}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '2px solid #3b82f6', fontSize: '1.1rem', fontWeight: 700, color: '#2563eb', width: '70px' }}
            />
            <label style={{ fontWeight: 500, color: '#475569' }}>Số B:</label>
            <input
              type="number"
              min={0}
              max={10}
              value={highlightB}
              onChange={(e) => setHighlightB(Math.min(10, Math.max(0, Number(e.target.value))))}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '2px solid #ef4444', fontSize: '1.1rem', fontWeight: 700, color: '#dc2626', width: '70px' }}
            />
          </div>

          {/* Interactive Number Line */}
          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', overflowX: 'auto' }}>
            <svg width="560" height="100" viewBox="0 0 560 100">
              {/* Line */}
              <line x1="20" y1="50" x2="540" y2="50" stroke="#94a3b8" strokeWidth="3" />

              {/* Arrow */}
              <polygon points="545,50 535,45 535,55" fill="#94a3b8" />

              {/* Ticks and numbers */}
              {Array.from({ length: 11 }, (_, i) => {
                const x = 30 + i * 48;
                const isA = i === highlightA;
                const isB = i === highlightB;
                const dotColor = isA ? '#2563eb' : isB ? '#ef4444' : '#64748b';
                const dotR = (isA || isB) ? 12 : 5;
                const textColor = isA ? '#2563eb' : isB ? '#ef4444' : '#475569';
                const fontWeight = (isA || isB) ? 800 : 500;
                const fontSize = (isA || isB) ? 16 : 13;

                return (
                  <g key={i}>
                    <line x1={x} y1="42" x2={x} y2="58" stroke={dotColor} strokeWidth={isA || isB ? 3 : 1.5} />
                    <circle cx={x} cy="50" r={dotR} fill={dotColor} opacity={isA || isB ? 0.2 : 1} />
                    <circle cx={x} cy="50" r={isA || isB ? 6 : 0} fill={dotColor} />
                    <text
                      x={x}
                      y="78"
                      textAnchor="middle"
                      fontSize={fontSize}
                      fontWeight={fontWeight}
                      fill={textColor}
                    >
                      {i}
                    </text>
                    {isA && (
                      <text x={x} y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2563eb">A</text>
                    )}
                    {isB && (
                      <text x={x} y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">B</text>
                    )}
                  </g>
                );
              })}

              {/* Direction */}
              <text x="270" y="95" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">Tăng →</text>
            </svg>

            {/* Result */}
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: highlightA === highlightB ? '#fef3c7' : '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                {highlightA < highlightB
                  ? `${highlightA} đứng bên trái ${highlightB} nên ${highlightA} < ${highlightB}`
                  : highlightA > highlightB
                    ? `${highlightA} đứng bên phải ${highlightB} nên ${highlightA} > ${highlightB}`
                    : `${highlightA} và ${highlightB} cùng điểm nên ${highlightA} = ${highlightB}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
