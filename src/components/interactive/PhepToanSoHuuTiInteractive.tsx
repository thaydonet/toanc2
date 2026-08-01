import { useState } from 'react';

type Op = '+' | '-' | '×' | ':';

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b);
}

function simplify(n: number, d: number): { n: number; d: number } {
  if (d < 0) { n = -n; d = -d; }
  if (n === 0) return { n: 0, d: 1 };
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genQuestion(): { a: number; b: number; c: number; d: number; op: Op } {
  const ops: Op[] = ['+', '-', '×', ':'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  return {
    a: randInt(1, 6),
    b: randInt(2, 6),
    c: randInt(1, 6),
    d: randInt(2, 6),
    op,
  };
}

function compute(a: number, b: number, c: number, d: number, op: Op) {
  let resN: number, resD: number;
  let steps: string[] = [];
  if (op === '+' || op === '-') {
    const common = lcm(b, d);
    const n1 = a * (common / b);
    const n2 = c * (common / d);
    steps = [
      `MSC = ${common}`,
      `${a}/${b} = ${n1}/${common} và ${c}/${d} = ${n2}/${common}`,
      op === '+'
        ? `${n1}/${common} + ${n2}/${common} = ${n1 + n2}/${common}`
        : `${n1}/${common} − ${n2}/${common} = ${n1 - n2}/${common}`,
    ];
    resN = op === '+' ? n1 + n2 : n1 - n2;
    resD = common;
  } else if (op === '×') {
    resN = a * c;
    resD = b * d;
    steps = [
      `${a}/${b} × ${c}/${d} = (${a} × ${c}) / (${b} × ${d}) = ${resN}/${resD}`,
    ];
  } else {
    resN = a * d;
    resD = b * c;
    steps = [
      `${a}/${b} : ${c}/${d} = ${a}/${b} × ${d}/${c} = (${a} × ${d}) / (${b} × ${c}) = ${resN}/${resD}`,
    ];
  }
  const res = simplify(resN, resD);
  if (resN !== res.n || resD !== res.d) {
    steps.push(`Rút gọn: ${resN}/${resD} = ${res.n}/${res.d}`);
  }
  return { resN, resD, res, steps };
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

const selectStyle: React.CSSProperties = {
  padding: '0.4rem 0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1',
  fontWeight: 700, fontSize: '1.05rem', background: '#ffffff',
};

export default function PhepToanSoHuuTiInteractive() {
  const [tab, setTab] = useState<'calc' | 'quiz'>('calc');

  // ── Tab 1: Máy tính phân số ──────────────────────────────────────────────
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [op, setOp] = useState<Op>('+');
  const [c, setC] = useState(1);
  const [d, setD] = useState(4);
  const calc = compute(a, b, c, d, op);

  // ── Tab 2: Luyện tập nhanh ───────────────────────────────────────────────
  const [q, setQ] = useState(genQuestion);
  const [numInput, setNumInput] = useState('');
  const [denInput, setDenInput] = useState('');
  const [checked, setChecked] = useState(false);
  const quiz = compute(q.a, q.b, q.c, q.d, q.op);
  const isCorrect =
    numInput.trim() !== '' && denInput.trim() !== '' &&
    Number(numInput) * quiz.res.d === quiz.res.n * Number(denInput);

  const nextQuestion = () => {
    setQ(genQuestion());
    setNumInput('');
    setDenInput('');
    setChecked(false);
  };

  const numOptions = Array.from({ length: 15 }, (_, i) => i - 7);
  const denOptions = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <div style={{
      background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px',
      padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem',
        borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '1.25rem' }}>⚡</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Phép tính với số hữu tỉ
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setTab('calc'); }} style={tabBtn(tab === 'calc')}>
          1. Máy tính có bước giải
        </button>
        <button onClick={() => setTab('quiz')} style={tabBtn(tab === 'quiz')}>
          2. Luyện tập nhanh
        </button>
      </div>

      {/* ───────── Tab 1: Máy tính ───────── */}
      {tab === 'calc' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Chọn hai số hữu tỉ và phép toán, xem từng bước giải chi tiết.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
            <select value={a} onChange={e => setA(Number(e.target.value))} style={selectStyle}>
              {numOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>/</span>
            <select value={b} onChange={e => setB(Number(e.target.value))} style={selectStyle}>
              {denOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <div style={{ display: 'flex', gap: '0.3rem', margin: '0 0.4rem' }}>
              {(['+', '-', '×', ':'] as Op[]).map(o => (
                <button key={o} onClick={() => setOp(o)}
                  style={{
                    width: '44px', height: '40px', borderRadius: '8px', border: '2px solid',
                    borderColor: op === o ? '#2563eb' : '#cbd5e1', cursor: 'pointer',
                    fontSize: '1.15rem', fontWeight: 800,
                    background: op === o ? '#2563eb' : '#ffffff', color: op === o ? '#ffffff' : '#1e293b',
                  }}>
                  {o}
                </button>
              ))}
            </div>

            <select value={c} onChange={e => setC(Number(e.target.value))} style={selectStyle}>
              {numOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>/</span>
            <select value={d} onChange={e => setD(Number(e.target.value))} style={selectStyle}>
              {denOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>=</span>
            <span style={{
              fontSize: '1.4rem', fontWeight: 800, color: '#059669',
              background: '#ecfdf5', padding: '0.3rem 0.9rem', borderRadius: '8px', border: '2px solid #6ee7b7',
            }}>
              {quiz.res.n}/{quiz.res.d}
            </span>
          </div>

          <div style={{
            background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1rem',
          }}>
            <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: '0.5rem' }}>🔎 Các bước giải:</div>
            {quiz.steps.map((s, i) => (
              <div key={i} style={{ padding: '0.35rem 0.6rem', fontSize: '0.95rem', color: '#334155', borderLeft: '3px solid #93c5fd', marginBottom: '0.3rem', background: '#f8fafc', borderRadius: '4px' }}>
                <strong>Bước {i + 1}:</strong> {s}
              </div>
            ))}
            <div style={{ marginTop: '0.5rem', fontWeight: 700, color: '#065f46' }}>
              Kết quả: {quiz.res.n}/{quiz.res.d}
              {quiz.res.d === 1 && ` = ${quiz.res.n}`}
            </div>
          </div>
        </div>
      )}

      {/* ───────── Tab 2: Luyện tập nhanh ───────── */}
      {tab === 'quiz' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Tính kết quả của phép tính rồi điền <strong>tử số</strong> và <strong>mẫu số</strong> của kết quả rút gọn (mẫu dương).
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap',
            padding: '1.1rem', borderRadius: '10px', background: '#ffffff', border: '2px solid #dbeafe',
            fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem',
          }}>
            {quiz.res.d === 1 ? (
              <span>Kết quả: {quiz.res.n}</span>
            ) : (
              <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.15 }}>
                <span style={{ borderBottom: '2.5px solid #1e293b', padding: '0 0.4rem' }}>{quiz.res.n}</span>
                <span style={{ padding: '0 0.4rem' }}>{quiz.res.d}</span>
              </span>
            )}
          </div>

          <div style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '1rem' }}>
            {q.a}/{q.b} &nbsp;{q.op}&nbsp; {q.c}/{q.d} = ?
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 700 }}>Kết quả:</span>
            <input
              type="number"
              value={numInput}
              onChange={e => setNumInput(e.target.value)}
              disabled={checked}
              placeholder="Tử số"
              style={{
                width: '90px', padding: '0.5rem 0.6rem', borderRadius: '8px',
                border: '2px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, textAlign: 'center',
              }}
            />
            <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>/</span>
            <input
              type="number"
              value={denInput}
              onChange={e => setDenInput(e.target.value)}
              disabled={checked}
              placeholder="Mẫu số"
              style={{
                width: '90px', padding: '0.5rem 0.6rem', borderRadius: '8px',
                border: '2px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, textAlign: 'center',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
            {!checked ? (
              <button onClick={() => { if (numInput.trim() !== '' && denInput.trim() !== '') setChecked(true); }}
                disabled={numInput.trim() === '' || denInput.trim() === ''}
                style={{
                  padding: '0.5rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700,
                  background: numInput.trim() !== '' && denInput.trim() !== '' ? '#2563eb' : '#cbd5e1',
                  color: numInput.trim() !== '' && denInput.trim() !== '' ? '#ffffff' : '#64748b',
                }}>
                ✅ Kiểm tra
              </button>
            ) : (
              <button onClick={nextQuestion}
                style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
                🔄 Câu mới
              </button>
            )}
          </div>

          {checked && (
            <div style={{
              marginTop: '1rem', padding: '0.8rem 1rem', borderRadius: '8px', fontWeight: 600,
              background: isCorrect ? '#dcfce7' : '#fee2e2',
              color: isCorrect ? '#166534' : '#991b1b',
              border: `1px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
            }}>
              {isCorrect ? '🎉 Chính xác! Bạn đã làm đúng.' : '❌ Chưa đúng. Hãy xem các bước giải dưới đây:'}
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                {quiz.steps.map((s, i) => (
                  <div key={i} style={{ padding: '0.25rem 0.4rem' }}>
                    <strong>Bước {i + 1}:</strong> {s}
                  </div>
                ))}
                <div style={{ marginTop: '0.3rem' }}>
                  <strong>Kết quả đúng:</strong> {quiz.res.n}/{quiz.res.d}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
