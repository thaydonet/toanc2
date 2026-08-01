import { useState } from 'react';

export default function SoThapPhanInteractive() {
  const [tab, setTab] = useState<'phanTich' | 'vietSo' | 'laMa'>('phanTich');

  // Tab 1: Phân tích số
  const [inputNumber, setInputNumber] = useState<number>(4567);
  const [showResult, setShowResult] = useState(false);

  const phanTich = (n: number) => {
    const str = String(n);
    const result: { hang: string; giaTri: number; chuSo: number }[] = [];
    const hangNames = ['Đơn vị', 'Chục', 'Trăm', 'Nghìn', 'Vạn', 'Triệu', 'Tỷ'];
    const hangValues = [1, 10, 100, 1000, 10000, 1000000, 1000000000];
    const digits = str.split('').reverse();
    for (let i = digits.length - 1; i >= 0; i--) {
      result.push({
        hang: hangNames[i] || `Hàng ${i}`,
        giaTri: hangValues[i] || Math.pow(10, i),
        chuSo: parseInt(digits[i])
      });
    }
    return result;
  };

  const result1 = phanTich(inputNumber);
  const tongCong = result1.reduce((sum, item) => sum + item.chuSo * item.giaTri, 0);

  // Tab 2: Viết số từ mô tả
  const [nghin, setNghin] = useState<number>(0);
  const [tram, setTram] = useState<number>(0);
  const [chuc, setChuc] = useState<number>(0);
  const [donVi, setDonVi] = useState<number>(0);

  const vietSo = nghin * 1000 + tram * 100 + chuc * 10 + donVi;

  // Tab 3: Số La Mã
  const [laMaInput, setLaMaInput] = useState<number>(2024);
  const [laMaResult, setLaMaResult] = useState('');

  const toLaMa = (num: number) => {
    if (num <= 0 || num > 3999) return 'Chỉ nhập từ 1 đến 3999';
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    let remaining = num;
    for (let i = 0; i < values.length; i++) {
      while (remaining >= values[i]) {
        result += symbols[i];
        remaining -= values[i];
      }
    }
    return result;
  };

  const handleConvertLaMa = () => {
    setLaMaResult(toLaMa(laMaInput));
  };

  // Tab 4: Từ La Mã sang thập phân
  const [laMaToDecInput, setLaMaToDecInput] = useState<string>('XXIV');
  const [laMaToDecResult, setLaMaToDecResult] = useState<number | string>('');
  const [laMaToDecError, setLaMaToDecError] = useState<string>('');

  const fromLaMa = (str: string) => {
    const map: { [key: string]: number } = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let result = 0;
    let prev = 0;
    for (let i = str.length - 1; i >= 0; i--) {
      const curr = map[str[i]];
      if (!curr) return -1;
      if (curr < prev) {
        result -= curr;
      } else {
        result += curr;
      }
      prev = curr;
    }
    return result;
  };

  const handleConvertFromLaMa = () => {
    const upper = laMaToDecInput.toUpperCase().trim();
    if (!upper) {
      setLaMaToDecError('Vui lòng nhập số La Mã');
      setLaMaToDecResult('');
      return;
    }
    for (const ch of upper) {
      if (!['I', 'V', 'X', 'L', 'C', 'D', 'M'].includes(ch)) {
        setLaMaToDecError('Ký tự không hợp lệ. Chỉ dùng: I, V, X, L, C, D, M');
        setLaMaToDecResult('');
        return;
      }
    }
    const val = fromLaMa(upper);
    if (val <= 0 || val > 3999) {
      setLaMaToDecError('Kết quả phải từ 1 đến 3999');
      setLaMaToDecResult('');
      return;
    }
    setLaMaToDecError('');
    setLaMaToDecResult(val);
  };

  // Tab 5: Kiểm tra chữ số theo hàng
  const [checkNum, setCheckNum] = useState<number>(54321);
  const [checkHang, setCheckHang] = useState<string>('chuc');
  const [checkResult, setCheckResult] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const hangOptions = [
    { value: 'donVi', label: 'Đơn vị' },
    { value: 'chuc', label: 'Chục' },
    { value: 'tram', label: 'Trăm' },
    { value: 'nghin', label: 'Nghìn' },
    { value: 'van', label: 'Vạn' },
  ];

  const getChuSo = (num: number, hang: string): number => {
    const str = String(num);
    const hangIndex: { [key: string]: number } = {
      donVi: 0, chuc: 1, tram: 2, nghin: 3, van: 4
    };
    const idx = hangIndex[hang];
    if (idx === undefined) return -1;
    const digits = str.split('').reverse();
    return idx < digits.length ? parseInt(digits[idx]) : 0;
  };

  const getGiaTri = (num: number, hang: string): number => {
    const cs = getChuSo(num, hang);
    const hangValues: { [key: string]: number } = {
      donVi: 1, chuc: 10, tram: 100, nghin: 1000, van: 10000
    };
    return cs * (hangValues[hang] || 1);
  };

  const handleCheckChuSo = () => {
    const cs = getChuSo(checkNum, checkHang);
    const gt = getGiaTri(checkNum, checkHang);
    setCheckResult({
      isCorrect: true,
      msg: `Chữ số ở hàng ${hangOptions.find(h => h.value === checkHang)?.label} là ${cs}, có giá trị ${gt.toLocaleString('vi-VN')}`
    });
  };

  return (
    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.25rem' }}>🔢</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Cách ghi số tự nhiên
        </h3>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { key: 'phanTich', label: '1. Phân tích số' },
          { key: 'vietSo', label: '2. Viết số từ mô tả' },
          { key: 'laMa', label: '3. Đổi số La Mã ↔ Thập phân' },
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

      {/* Tab 1: Phân tích số */}
      {tab === 'phanTich' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Nhập số tự nhiên cần phân tích theo hàng:
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <input
              type="number"
              value={inputNumber}
              onChange={(e) => { setInputNumber(Number(e.target.value)); setShowResult(false); }}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #93c5fd', fontSize: '1.1rem', fontWeight: 600, width: '150px' }}
            />
            <button
              onClick={() => setShowResult(true)}
              style={{ padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Phân tích
            </button>
          </div>

          {showResult && (
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <p style={{ margin: '0 0 0.75rem 0', fontWeight: 700, color: '#1e293b', fontSize: '1.05rem' }}>
                Số {inputNumber.toLocaleString('vi-VN')} được phân tích:
              </p>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#eff6ff' }}>
                      <th style={{ border: '1px solid #cbd5e1', padding: '0.5rem', textAlign: 'center', color: '#1d4ed8' }}>Hàng</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '0.5rem', textAlign: 'center', color: '#1d4ed8' }}>Giá trị hàng</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '0.5rem', textAlign: 'center', color: '#1d4ed8' }}>Chữ số</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '0.5rem', textAlign: 'center', color: '#1d4ed8' }}>Tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result1.map((item, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9fafb' : '#ffffff' }}>
                        <td style={{ border: '1px solid #cbd5e1', padding: '0.5rem', textAlign: 'center', fontWeight: 600 }}>{item.hang}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '0.5rem', textAlign: 'center' }}>{item.giaTri.toLocaleString('vi-VN')}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '0.5rem', textAlign: 'center', fontWeight: 700, color: '#dc2626', fontSize: '1.1rem' }}>{item.chuSo}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '0.5rem', textAlign: 'center' }}>{item.chuSo} × {item.giaTri.toLocaleString('vi-VN')} = <strong>{(item.chuSo * item.giaTri).toLocaleString('vi-VN')}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Result */}
              <div style={{ background: '#f0f9ff', borderLeft: '4px solid #2563eb', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e40af' }}>
                  {inputNumber.toLocaleString('vi-VN')} = {result1.map(item => `${item.chuSo} × ${item.giaTri.toLocaleString('vi-VN')}`).join(' + ')} = {result1.map(item => `${(item.chuSo * item.giaTri).toLocaleString('vi-VN')}`).join(' + ')} = <span style={{ color: '#dc2626' }}>{tongCong.toLocaleString('vi-VN')}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Viết số từ mô tả */}
      {tab === 'vietSo' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Nhập số lượng từng hàng chữ số:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Nghìn', value: nghin, set: setNghin, max: 9 },
              { label: 'Trăm', value: tram, set: setTram, max: 9 },
              { label: 'Chục', value: chuc, set: setChuc, max: 9 },
              { label: 'Đơn vị', value: donVi, set: setDonVi, max: 9 },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>{item.label}</label>
                <input
                  type="number"
                  min={0}
                  max={item.max}
                  value={item.value}
                  onChange={(e) => item.set(Math.min(item.max, Math.max(0, Number(e.target.value))))}
                  style={{ width: '70px', padding: '0.4rem', borderRadius: '6px', border: '2px solid #93c5fd', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}
                />
              </div>
            ))}
          </div>

          {/* Display */}
          <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#64748b' }}>
              {nghin} nghìn, {tram} trăm, {chuc} chục, {donVi} đơn vị
            </p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>
              {vietSo.toLocaleString('vi-VN')}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
              = {nghin} × 1.000 + {tram} × 100 + {chuc} × 10 + {donVi} × 1
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Số La Mã */}
      {tab === 'laMa' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {/* Thập phân → La Mã */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 0.75rem 0', fontWeight: 600, color: '#334155' }}>
              <strong>Thập phân → La Mã:</strong> Nhập số tự nhiên (1 - 3999):
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="number"
                min={1}
                max={3999}
                value={laMaInput}
                onChange={(e) => setLaMaInput(Math.min(3999, Math.max(1, Number(e.target.value))))}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #93c5fd', fontSize: '1.1rem', fontWeight: 600, width: '120px' }}
              />
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6366f1' }}>→</span>
              <button
                onClick={handleConvertLaMa}
                style={{ padding: '0.5rem 1.5rem', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Đổi sang La Mã
              </button>
              {laMaResult && (
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'serif' }}>{laMaResult}</span>
              )}
            </div>
          </div>

          {/* La Mã → Thập phân */}
          <div>
            <p style={{ margin: '0 0 0.75rem 0', fontWeight: 600, color: '#334155' }}>
              <strong>La Mã → Thập phân:</strong> Nhập số La Mã:
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={laMaToDecInput}
                onChange={(e) => setLaMaToDecInput(e.target.value.toUpperCase())}
                placeholder="Ví dụ: MMXXIV"
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #c4b5fd', fontSize: '1.1rem', fontWeight: 600, width: '150px', fontFamily: 'serif', letterSpacing: '2px' }}
              />
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6366f1' }}>→</span>
              <button
                onClick={handleConvertFromLaMa}
                style={{ padding: '0.5rem 1.5rem', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Đổi sang thập phân
              </button>
              {laMaToDecError && (
                <span style={{ color: '#dc2626', fontWeight: 500, fontSize: '0.9rem' }}>{laMaToDecError}</span>
              )}
              {laMaToDecResult !== '' && (
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>{laMaToDecResult.toLocaleString('vi-VN')}</span>
              )}
            </div>
          </div>

          {/* Bảng tra cứu nhanh */}
          <div style={{ marginTop: '1.5rem', background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Bảng tra cứu nhanh:</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { sym: 'I', val: 1 }, { sym: 'V', val: 5 }, { sym: 'X', val: 10 },
                { sym: 'L', val: 50 }, { sym: 'C', val: 100 }, { sym: 'D', val: 500 }, { sym: 'M', val: 1000 },
              ].map(item => (
                <div key={item.sym} style={{ background: '#eff6ff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #bfdbfe', textAlign: 'center', minWidth: '50px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'serif' }}>{item.sym}</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>= {item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
