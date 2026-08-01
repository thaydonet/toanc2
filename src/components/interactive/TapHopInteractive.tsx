import { useState } from 'react';

export default function TapHopInteractive() {
  const [tab, setTab] = useState<'check' | 'build' | 'count'>('check');

  // Tab 1 state
  const [checkNum, setCheckNum] = useState<number>(5);
  const [checkSymbol, setCheckSymbol] = useState<'in' | 'notin'>('in');
  const [checkResult, setCheckResult] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const setA = [2, 3, 5, 7, 11, 13, 17, 19];

  const handleCheck = () => {
    const isMember = setA.includes(checkNum);
    const userChoiceIn = checkSymbol === 'in';
    const isCorrect = isMember === userChoiceIn;

    if (isCorrect) {
      setCheckResult({
        isCorrect: true,
        msg: `Đúng rồi! ${checkNum} ${isMember ? 'là' : 'không phải là'} số nguyên tố nhỏ hơn 20, nên ${checkNum} ${isMember ? '∈' : '∉'} A.`
      });
    } else {
      setCheckResult({
        isCorrect: false,
        msg: `Chưa đúng! ${checkNum} ${isMember ? 'có nằm' : 'không nằm'} trong tập hợp A = {2; 3; 5; 7; 11; 13; 17; 19}.`
      });
    }
  };

  // Tab 2 state
  const [selectedNums, setSelectedNums] = useState<number[]>([]);
  const targetB = [5, 6, 7, 8, 9];
  const [buildResult, setBuildResult] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const toggleNum = (num: number) => {
    if (selectedNums.includes(num)) {
      setSelectedNums(selectedNums.filter(n => n !== num));
    } else {
      setSelectedNums([...selectedNums, num].sort((a, b) => a - b));
    }
  };

  const handleCheckBuild = () => {
    const isMatch = selectedNums.length === targetB.length && selectedNums.every(n => targetB.includes(n));
    if (isMatch) {
      setBuildResult({
        isCorrect: true,
        msg: 'Chính xác! Các số tự nhiên x thỏa mãn 5 ≤ x < 10 là 5; 6; 7; 8; 9.'
      });
    } else {
      setBuildResult({
        isCorrect: false,
        msg: 'Chưa chính xác. Chú ý: x ≥ 5 (lấy số 5) và x < 10 (không lấy số 10).'
      });
    }
  };

  // Tab 3 state
  const [startNum, setStartNum] = useState<number>(12);
  const [endNum, setEndNum] = useState<number>(48);
  const [stepNum, setStepNum] = useState<number>(3);

  const calculateCount = () => {
    if (endNum < startNum || stepNum <= 0) return { count: 0, items: [] };
    const items: number[] = [];
    for (let i = startNum; i <= endNum; i += stepNum) {
      items.push(i);
    }
    return {
      count: items.length,
      items
    };
  };

  const countData = calculateCount();

  return (
    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.25rem' }}>⚡</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Khám phá Tập hợp
        </h3>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setTab('check')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: tab === 'check' ? '#2563eb' : '#f1f5f9',
            color: tab === 'check' ? '#ffffff' : '#475569',
            transition: 'all 0.2s'
          }}
        >
          1. Kiểm tra ký hiệu ∈ / ∉
        </button>
        <button
          onClick={() => setTab('build')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: tab === 'build' ? '#2563eb' : '#f1f5f9',
            color: tab === 'build' ? '#ffffff' : '#475569',
            transition: 'all 0.2s'
          }}
        >
          2. Liệt kê phần tử tập hợp
        </button>
        <button
          onClick={() => setTab('count')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: tab === 'count' ? '#2563eb' : '#f1f5f9',
            color: tab === 'count' ? '#ffffff' : '#475569',
            transition: 'all 0.2s'
          }}
        >
          3. Đếm số phần tử dãy cách đều
        </button>
      </div>

      {/* Tab 1: Check Membership */}
      {tab === 'check' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Cho tập hợp <code style={{ color: '#2563eb', fontSize: '1.05rem' }}>A = {'{2; 3; 5; 7; 11; 13; 17; 19}'}</code> (tập hợp các số nguyên tố nhỏ hơn 20).
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span>Chọn số:</span>
            <select
              value={checkNum}
              onChange={(e) => setCheckNum(Number(e.target.value))}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '1rem' }}
            >
              {Array.from({ length: 21 }, (_, i) => i).map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <span>Chọn ký hiệu:</span>
            <select
              value={checkSymbol}
              onChange={(e) => setCheckSymbol(e.target.value as 'in' | 'notin')}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '1.1rem', color: '#2563eb' }}
            >
              <option value="in">∈</option>
              <option value="notin">∉</option>
            </select>

            <span style={{ fontWeight: 700 }}>A</span>

            <button
              onClick={handleCheck}
              style={{ padding: '0.4rem 1.2rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Kiểm tra
            </button>
          </div>

          {checkResult && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: checkResult.isCorrect ? '#dcfce7' : '#fee2e2', color: checkResult.isCorrect ? '#166534' : '#991b1b', border: `1px solid ${checkResult.isCorrect ? '#86efac' : '#fca5a5'}`, fontWeight: 500 }}>
              {checkResult.msg}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Build Set */}
      {tab === 'build' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Yêu cầu: Hãy chọn các số thuộc tập hợp <code style={{ color: '#2563eb', fontSize: '1.05rem' }}>B = {'{x ∈ ℕ | 5 ≤ x < 10}'}</code>
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {Array.from({ length: 13 }, (_, i) => i).map(n => {
              const isSelected = selectedNums.includes(n);
              return (
                <button
                  key={n}
                  onClick={() => toggleNum(n)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: isSelected ? '#2563eb' : '#cbd5e1',
                    backgroundColor: isSelected ? '#3b82f6' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#1e293b',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600 }}>Tập hợp B bạn chọn: </span>
            <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.1rem' }}>
              B = {'{'}{selectedNums.join('; ')}{'}'}
            </span>
            <button
              onClick={handleCheckBuild}
              style={{ padding: '0.4rem 1.2rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Xác nhận
            </button>
          </div>

          {buildResult && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: buildResult.isCorrect ? '#dcfce7' : '#fee2e2', color: buildResult.isCorrect ? '#166534' : '#991b1b', border: `1px solid ${buildResult.isCorrect ? '#86efac' : '#fca5a5'}`, fontWeight: 500 }}>
              {buildResult.msg}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Count Elements */}
      {tab === 'count' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Tính số phần tử của tập hợp các số cách đều: <code style={{ color: '#2563eb', fontSize: '1.05rem' }}>C = {'{a; a+d; a+2d; ...; b}'}</code>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Số đầu (a):</label>
              <input
                type="number"
                value={startNum}
                onChange={(e) => setStartNum(Number(e.target.value))}
                style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Số cuối (b):</label>
              <input
                type="number"
                value={endNum}
                onChange={(e) => setEndNum(Number(e.target.value))}
                style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Khoảng cách (d):</label>
              <input
                type="number"
                min={1}
                value={stepNum}
                onChange={(e) => setStepNum(Math.max(1, Number(e.target.value)))}
                style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600 }}
              />
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: '#1e293b' }}>
              Công thức: Số phần tử = <span style={{ color: '#2563eb' }}>(Số cuối - Số đầu) : Khoảng cách + 1</span>
            </p>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0f172a' }}>
              Tính toán: <code style={{ color: '#059669', fontWeight: 700 }}>({endNum} - {startNum}) : {stepNum} + 1 = {countData.count} phần tử</code>
            </p>
            <div style={{ fontSize: '0.9rem', color: '#475569', wordBreak: 'break-word' }}>
              <strong>Danh sách phần tử ({countData.items.length > 20 ? 'hiển thị 20 đầu tiên' : 'tất cả'}):</strong>{' '}
              {'{'}{countData.items.slice(0, 20).join('; ')}{countData.items.length > 20 ? '; ...' : ''}{'}'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
