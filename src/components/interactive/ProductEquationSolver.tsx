import { useState } from 'react';
import LatexText from '../ui/LatexText';

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function factorLatex(coef: number, constTerm: number): string {
  let s = '';
  if (coef === 1) s = 'x';
  else if (coef === -1) s = '-x';
  else s = `${coef}x`;
  if (constTerm > 0) s += ` + ${constTerm}`;
  else if (constTerm < 0) s += ` - ${Math.abs(constTerm)}`;
  return s;
}

function fracLatex(n: number, d: number = 1): string {
  if (d === 0) return '\\infty';
  if (n === 0) return '0';
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d);
  n /= g; d /= g;
  if (d === 1) return String(n);
  const sign = n < 0 ? '-' : '';
  return `${sign}\\frac{${Math.abs(n)}}{${d}}`;
}

function genRandom() {
  let a = randInt(-5, 5);
  while (a === 0) a = randInt(-5, 5);
  let b = randInt(-8, 8);
  while (b === 0) b = randInt(-8, 8);
  let c = randInt(-5, 5);
  while (c === 0) c = randInt(-5, 5);
  let d = randInt(-8, 8);
  while (d === 0) d = randInt(-8, 8);
  return { a, b, c, d };
}

interface Result { steps: string[]; conclusion: string; }

function computeSteps(a: number, b: number, c: number, d: number): Result {
  const steps: string[] = [];
  const solutions: string[] = [];
  let infinite = false;

  const equation = `(${factorLatex(a, b)})(${factorLatex(c, d)}) = 0`;
  steps.push(`Ta có: $${equation}$`);
  steps.push('Phương trình tích bằng 0 khi một trong các nhân tử bằng 0:');

  const addFactor = (coef: number, constTerm: number) => {
    const fac = factorLatex(coef, constTerm);
    if (coef === 0 && constTerm === 0) {
      infinite = true;
      steps.push(`Nhân tử $${fac}$ bằng $0$ với mọi $x$, mọi $x$ đều thỏa mãn.`);
    } else if (coef === 0) {
      steps.push(`Nhân tử $${fac}$ là hằng số khác $0$, không cho nghiệm.`);
    } else {
      const x = fracLatex(-constTerm, coef);
      solutions.push(x);
      steps.push(`• $${fac} = 0 \\Rightarrow x = ${x}$`);
    }
  };

  addFactor(a, b);
  addFactor(c, d);

  let conclusion: string;
  if (infinite) {
    conclusion = 'Vậy phương trình có vô số nghiệm.';
  } else if (solutions.length === 2) {
    conclusion = `Vậy tập nghiệm: $S = \\{${solutions[0]}; ${solutions[1]}\\}$`;
  } else if (solutions.length === 1) {
    conclusion = `Vậy tập nghiệm: $S = \\{${solutions[0]}\\}$`;
  } else {
    conclusion = 'Vậy phương trình vô nghiệm.';
  }

  return { steps, conclusion };
}

export default function ProductEquationSolver() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(1);
  const [d, setD] = useState(-4);
  const [solved, setSolved] = useState(false);

  const result = computeSteps(a, b, c, d);

  const newProblem = () => {
    const r = genRandom();
    setA(r.a); setB(r.b); setC(r.c); setD(r.d);
    setSolved(false);
  };

  const inputStyle: React.CSSProperties = {
    width: 60,
    padding: '6px 4px',
    textAlign: 'center',
    border: '2px solid #bbf7d0',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: '1rem',
    color: '#15803d',
    background: 'white',
    outline: 'none',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ background: '#f0fdf4', borderLeft: '4px solid #22c55e', padding: '1rem', margin: '1rem 0', borderRadius: '0 8px 8px 0' }}>
      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#166534' }}>
        Thực hành — Phương trình tích
      </h4>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap', background: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '1.15rem', fontWeight: 700, color: '#14532d' }}>
        <span>(</span>
        <input type="number" value={a} onChange={e => setA(Number(e.target.value))} style={inputStyle} />
        <span>x +</span>
        <input type="number" value={b} onChange={e => setB(Number(e.target.value))} style={inputStyle} />
        <span>)(</span>
        <input type="number" value={c} onChange={e => setC(Number(e.target.value))} style={inputStyle} />
        <span>x +</span>
        <input type="number" value={d} onChange={e => setD(Number(e.target.value))} style={inputStyle} />
        <span>) = 0</span>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
        Nhập hệ số vào các ô (hoặc bấm <strong>Sinh đề mới</strong>), rồi bấm <strong>Giải</strong>.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        <button onClick={newProblem} style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          🎲 Sinh đề mới
        </button>
        <button onClick={() => setSolved(true)} style={{ padding: '0.5rem 1.5rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          Giải
        </button>
      </div>

      {solved && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#166534' }}>Bài giải:</p>
          {result.steps.map((st, i) => (
            <p key={i} style={{ marginBottom: '0.3rem' }}><LatexText>{st}</LatexText></p>
          ))}
          <p style={{ fontWeight: 600, color: '#166534', marginTop: '0.5rem' }}><LatexText>{result.conclusion}</LatexText></p>
        </div>
      )}
    </div>
  );
}
