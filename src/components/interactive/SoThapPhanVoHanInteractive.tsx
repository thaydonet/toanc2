import { useState } from 'react';

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

interface Expansion {
  sign: string;
  intPart: number;
  digits: number[];
  remainders: number[];
  cycleStart: number | null;
  cycleLen: number;
  finite: boolean;
}

function expand(num: number, den: number): Expansion {
  let n = Math.abs(num), d = Math.abs(den);
  const sign = (num < 0) !== (den < 0) ? '-' : '';
  const g = gcd(n, d);
  n /= g; d /= g;
  const intPart = Math.floor(n / d);
  n = n % d;
  const digits: number[] = [];
  const remainders: number[] = [];
  const seen = new Map<number, number>();
  let i = 0;
  while (n !== 0) {
    if (seen.has(n)) {
      return { sign, intPart, digits, remainders, cycleStart: seen.get(n)!, cycleLen: i - seen.get(n)!, finite: false };
    }
    seen.set(n, i);
    remainders.push(n);
    n *= 10;
    digits.push(Math.floor(n / d));
    n = n % d;
    i++;
  }
  return { sign, intPart, digits, remainders, cycleStart: null, cycleLen: 0, finite: true };
}

const tabBtn = (active: boolean): React.CSSProperties => ({
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  backgroundColor: active ? '#2563eb' : '#f1f5f9',
  color: active ? '#ffffff' : '#475569',
  transition: 'all 0.2s',
});

interface ClassifyItem {
  label: string;
  repeating: boolean;
  why: string;
}

const CLASSIFY_ITEMS: ClassifyItem[] = [
  { label: '0,5', repeating: false, why: '0,5 = 1/2 là số thập phân hữu hạn.' },
  { label: '0,333...', repeating: true, why: '0,333... = 1/3 có chữ số 3 lặp lại vô hạn nên là vô hạn tuần hoàn.' },
  { label: '0,25', repeating: false, why: '0,25 = 1/4 có hữu hạn chữ số sau dấu phẩy.' },
  { label: '0,1666...', repeating: true, why: '0,1666... = 1/6 có chữ số 6 lặp lại vô hạn nên là vô hạn tuần hoàn.' },
  { label: '1,5', repeating: false, why: '1,5 = 3/2 là số thập phân hữu hạn.' },
  { label: '0,121212...', repeating: true, why: '0,121212... có nhóm 12 lặp lại vô hạn nên là vô hạn tuần hoàn.' },
  { label: '3,2', repeating: false, why: '3,2 = 16/5 là số thập phân hữu hạn.' },
  { label: '0,090909...', repeating: true, why: '0,090909... có nhóm 09 lặp lại vô hạn nên là vô hạn tuần hoàn.' },
];

const COMPARE_POOL = [
  { label: '0,333...', n: 1, d: 3 },
  { label: '0,666...', n: 2, d: 3 },
  { label: '0,777...', n: 7, d: 9 },
  { label: '0,1212...', n: 4, d: 33 },
  { label: '0,0909...', n: 1, d: 11 },
  { label: '0,4545...', n: 5, d: 11 },
  { label: '0,1666...', n: 1, d: 6 },
  { label: '0,8333...', n: 5, d: 6 },
  { label: '0,2555...', n: 23, d: 90 },
  { label: '0,25', n: 1, d: 4 },
  { label: '0,4', n: 2, d: 5 },
];

function digitsOf(n: number, d: number, len = 12): number[] {
  const exp = expand(n, d);
  const out: number[] = [];
  let k = 0;
  while (out.length < len) {
    out.push(exp.digits[k % exp.digits.length]);
    k++;
  }
  return out;
}

export default function SoThapPhanVoHanInteractive() {
  const [tab, setTab] = useState<'chuyen' | 'phanLoai' | 'soSanh'>('chuyen');

  // ── Tab 1: Chuyển phân số → số thập phân ────────────────────────────────
  const [tu, setTu] = useState(1);
  const [mau, setMau] = useState(3);
  const exp = expand(tu, mau);

  // ── Tab 2: Phân loại ────────────────────────────────────────────────────
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState(false);
  const choose = (idx: number, rep: boolean) => {
    if (checked) return;
    setAnswers(prev => ({ ...prev, [idx]: rep }));
  };
  const correctCount = CLASSIFY_ITEMS.filter((it, i) => answers[i] === it.repeating).length;
  const allAnswered = CLASSIFY_ITEMS.every((_, i) => i in answers);

  // ── Tab 3: So sánh ───────────────────────────────────────────────────────
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(4);
  const A = COMPARE_POOL[idxA], B = COMPARE_POOL[idxB];
  const cross = A.n * B.d - B.n * A.d;
  const cmp = cross > 0 ? '>' : cross < 0 ? '<' : '=';
  const digA = digitsOf(A.n, A.d);
  const digB = digitsOf(B.n, B.d);
  let firstDiff = -1;
  for (let i = 0; i < digA.length; i++) {
    if (digA[i] !== digB[i]) { firstDiff = i; break; }
  }

  const numOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const denOptions = Array.from({ length: 11 }, (_, i) => i + 2);

  return (
    <div style={{
      background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px',
      padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem',
        borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '1.25rem' }}>🔁</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Số thập phân vô hạn tuần hoàn
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setTab('chuyen'); }} style={tabBtn(tab === 'chuyen')}>
          1. Phân số → số thập phân
        </button>
        <button onClick={() => { setTab('phanLoai'); setChecked(false); }} style={tabBtn(tab === 'phanLoai')}>
          2. Phân loại thập phân
        </button>
        <button onClick={() => setTab('soSanh')} style={tabBtn(tab === 'soSanh')}>
          3. So sánh hai số
        </button>
      </div>

      {/* ───────── Tab 1: Chuyển phân số ───────── */}
      {tab === 'chuyen' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Chọn tử số và mẫu số để viết phân số <strong>tử/mẫu</strong> dưới dạng số thập phân:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                Tử số: <strong style={{ color: '#2563eb' }}>{tu}</strong>
              </label>
              <select value={tu} onChange={e => setTu(Number(e.target.value))}
                style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, width: '100%' }}>
                {numOptions.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                Mẫu số: <strong style={{ color: '#2563eb' }}>{mau}</strong>
              </label>
              <select value={mau} onChange={e => setMau(Number(e.target.value))}
                style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, width: '100%' }}>
                {denOptions.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              {tu}/{mau} = <span style={{ color: '#2563eb' }}>{exp.sign}{exp.intPart},</span>
              {exp.digits.map((d, i) => {
                const inCycle = exp.cycleStart !== null && i >= exp.cycleStart;
                return (
                  <span key={i} style={{
                    color: inCycle ? '#dc2626' : '#2563eb',
                    fontWeight: inCycle ? 800 : 700,
                    textDecoration: inCycle ? 'underline' : 'none',
                    textDecorationThickness: '2px',
                  }}>{d}</span>
                );
              })}
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>...</span>
            </div>
            <div style={{
              display: 'inline-block', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700,
              background: exp.finite ? '#dcfce7' : '#fef3c7', color: exp.finite ? '#166534' : '#92400e',
            }}>
              {exp.finite
                ? '✅ Số thập phân hữu hạn'
                : <>🔁 Vô hạn tuần hoàn — chu kỳ có {exp.cycleLen} chữ số (phần bôi đỏ)</>}
            </div>
            {!exp.finite && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.9rem', color: '#475569' }}>
                Chu kỳ: <strong style={{ color: '#dc2626' }}>{exp.digits.slice(exp.cycleStart!, exp.cycleStart! + exp.cycleLen).join('')}</strong>
                {' '}— Các số dư lặp lại: {exp.remainders.slice(exp.cycleStart!).join(', ')} nên các chữ số lặp lại mãi mãi.
              </div>
            )}
            {exp.finite && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.9rem', color: '#475569' }}>
                Số dư cuối cùng bằng 0 nên phép chia kết thúc.
              </div>
            )}
            {exp.digits.length <= 2 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                💡 Thử chọn mẫu số 3, 6, 7, 9 hoặc 11 để xem các số thập phân vô hạn tuần hoàn.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────── Tab 2: Phân loại ───────── */}
      {tab === 'phanLoai' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Với mỗi số sau, hãy xác định đó là số thập phân <strong style={{ color: '#059669' }}>hữu hạn</strong> hay{' '}
            <strong style={{ color: '#b45309' }}>vô hạn tuần hoàn</strong>:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {CLASSIFY_ITEMS.map((it, i) => {
              const ans = answers[i];
              const showState = checked && ans !== undefined;
              const ok = checked && ans === it.repeating;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
                  padding: '0.55rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff',
                }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', minWidth: '90px' }}>
                    {it.label}
                  </span>
                  <span style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => choose(i, false)}
                      style={{
                        padding: '0.3rem 0.9rem', borderRadius: '6px', border: '2px solid #059669', cursor: 'pointer',
                        fontWeight: 700, background: ans === false ? '#059669' : '#ffffff',
                        color: ans === false ? '#ffffff' : '#059669', opacity: checked ? 0.6 : 1,
                      }}>
                      Hữu hạn
                    </button>
                    <button onClick={() => choose(i, true)}
                      style={{
                        padding: '0.3rem 0.9rem', borderRadius: '6px', border: '2px solid #d97706', cursor: 'pointer',
                        fontWeight: 700, background: ans === true ? '#d97706' : '#ffffff',
                        color: ans === true ? '#ffffff' : '#d97706', opacity: checked ? 0.6 : 1,
                      }}>
                      Vô hạn tuần hoàn
                    </button>
                  </span>
                  {showState && (
                    <span style={{
                      fontSize: '0.8rem', fontWeight: 700, color: ok ? '#166534' : '#991b1b',
                      background: ok ? '#dcfce7' : '#fee2e2', padding: '0.2rem 0.6rem', borderRadius: '999px',
                    }}>
                      {ok ? '✓ Đúng' : '✗ Sai'}
                    </span>
                  )}
                  {checked && ans !== undefined && !ok && (
                    <span style={{ flexBasis: '100%', fontSize: '0.82rem', color: '#991b1b' }}>{it.why}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
            {!checked ? (
              <button onClick={() => { if (allAnswered) setChecked(true); }}
                disabled={!allAnswered}
                style={{
                  padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700,
                  background: allAnswered ? '#10b981' : '#cbd5e1', color: allAnswered ? '#ffffff' : '#64748b',
                }}>
                ✅ Kiểm tra
              </button>
            ) : (
              <button onClick={() => { setChecked(false); setAnswers({}); }}
                style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
                🔄 Làm lại
              </button>
            )}
            {checked && (
              <span style={{
                padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem',
                background: correctCount === CLASSIFY_ITEMS.length ? '#dcfce7' : '#fef3c7',
                color: correctCount === CLASSIFY_ITEMS.length ? '#166534' : '#92400e',
              }}>
                Kết quả: {correctCount}/{CLASSIFY_ITEMS.length} câu đúng
              </span>
            )}
            {!allAnswered && !checked && (
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Hãy trả lời đủ {CLASSIFY_ITEMS.length} số rồi bấm Kiểm tra.</span>
            )}
          </div>
        </div>
      )}

      {/* ───────── Tab 3: So sánh ───────── */}
      {tab === 'soSanh' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Chọn hai số thập phân, công cụ sẽ so sánh chúng bằng cách xét từng chữ số từ trái sang phải:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {[
              { label: 'Số thứ nhất', idx: idxA, setIdx: setIdxA, color: '#2563eb', val: A },
              { label: 'Số thứ hai', idx: idxB, setIdx: setIdxB, color: '#059669', val: B },
            ].map((f, k) => (
              <div key={k} style={{ padding: '0.9rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: f.color }}>{f.label}</div>
                <select value={f.idx} onChange={e => f.setIdx(Number(e.target.value))}
                  style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, width: '100%' }}>
                  {COMPARE_POOL.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '0.8rem' }}>
            {[
              { label: A.label, digits: digA, color: '#2563eb', isA: true },
              { label: B.label, digits: digB, color: '#059669', isA: false },
            ].map((row, k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ minWidth: '90px', fontWeight: 700, color: row.color }}>{row.label}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 600, color: '#334155' }}>
                  {row.digits.map((d, i) => (
                    <span key={i} style={{
                      color: firstDiff === i ? '#dc2626' : '#334155',
                      background: firstDiff === i ? '#fee2e2' : 'transparent',
                      padding: firstDiff === i ? '0 2px' : '0',
                      borderRadius: '4px',
                      fontWeight: firstDiff === i ? 800 : 600,
                    }}>{d}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.95rem',
            background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe',
          }}>
            <strong>Kết luận:</strong>{' '}
            <strong style={{ fontSize: '1.05rem' }}>{A.label} {cmp} {B.label}</strong>
            {firstDiff === -1
              ? ' (hai số bằng nhau — các chữ số hoàn toàn giống nhau).'
              : <> vì tại chữ số thứ {firstDiff + 1} sau dấu phẩy, {digA[firstDiff]} {cmp} {digB[firstDiff]}.</>}
          </div>
        </div>
      )}
    </div>
  );
}
