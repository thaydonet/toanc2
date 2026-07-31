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

interface Problem { a: number; c: number; d: number; e: number; }

function genProblem(): Problem {
  const c = randInt(-2, 4);
  let e = randInt(-2, 4);
  while (e === c) e = randInt(-2, 4);
  const a = randInt(1, 4);
  let d = randInt(1, 4);
  while (d === a) d = randInt(1, 4);
  return { a, c, d, e };
}

interface Result { steps: string[]; conclusion: string; }

function binLatex(k: number): string {
  if (k === 0) return 'x';
  if (k > 0) return `x - ${k}`;
  return `x + ${-k}`;
}

function computeSteps(p: Problem): Result {
  const { a, c, d, e } = p;
  const steps: string[] = [];
  let conclusion = '';

  steps.push(`Bước 1 — ĐKXĐ: $x \\neq ${c}$ và $x \\neq ${e}$`);
  steps.push(`Bước 2 — Quy đồng mẫu chung $(${binLatex(c)})(${binLatex(e)})$ rồi khử mẫu:`);
  steps.push(`$${a} \\cdot (${binLatex(e)}) = ${d} \\cdot (${binLatex(c)})$`);

  const coef = a - d;
  const rhs = a * e - d * c;

  if (coef !== 0) {
    const coefStr = coef === 1 ? '' : coef === -1 ? '-' : String(coef);
    steps.push(`Bước 3 — Khai triển & chuyển vế: $${coefStr}x = ${rhs}$`);
    const x = fracLatex(rhs, coef);
    steps.push(`Bước 4 — $x = ${x}$`);
    const isExcluded = rhs / coef === c || rhs / coef === e;
    if (isExcluded) {
      steps.push(`Bước 5 — $x = ${x}$ vi phạm ĐKXĐ nên bị loại.`);
      conclusion = 'Vậy phương trình vô nghiệm.';
    } else {
      steps.push(`Bước 5 — $x = ${x}$ thỏa mãn ĐKXĐ.`);
      conclusion = `Vậy phương trình có nghiệm $x = ${x}$.`;
    }
  } else if (rhs === 0) {
    steps.push(`Bước 3 — $0x = 0$, đúng với mọi $x$ (kèm ĐKXĐ $x \\neq ${c}, x \\neq ${e}$).`);
    conclusion = `Vậy phương trình có vô số nghiệm: mọi $x \\neq ${c}$, $x \\neq ${e}$.`;
  } else {
    steps.push(`Bước 3 — $0x = ${rhs}$ (vô lý).`);
    conclusion = 'Vậy phương trình vô nghiệm.';
  }

  return { steps, conclusion };
}

export default function RationalEquationSolver() {
  const [prob, setProb] = useState<Problem>(genProblem());
  const [solved, setSolved] = useState(false);

  const result = computeSteps(prob);

  const newProblem = () => {
    setProb(genProblem());
    setSolved(false);
  };

  const setField = (k: keyof Problem) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProb(p => ({ ...p, [k]: Number(e.target.value) }));
  };

  const inputStyle: React.CSSProperties = {
    width: 58,
    padding: '5px 4px',
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

  const NumInput = ({ field, width }: { field: keyof Problem; width?: number }) => (
    <input
      type="number"
      value={prob[field]}
      onChange={setField(field)}
      style={width ? { ...inputStyle, width } : inputStyle}
    />
  );

  const fracBlock = (num: React.ReactNode, den: React.ReactNode) => (
    <div style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>{num}</div>
      <div style={{ borderTop: '2px solid #14532d', marginTop: '5px', paddingTop: '5px', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>{den}</div>
    </div>
  );

  return (
    <div style={{ background: '#f0fdf4', borderLeft: '4px solid #22c55e', padding: '1rem', margin: '1rem 0', borderRadius: '0 8px 8px 0' }}>
      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#166534' }}>
        Thực hành — Phương trình chứa ẩn ở mẫu
      </h4>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.9rem', flexWrap: 'wrap', background: 'white', padding: '0.9rem', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
        {fracBlock(
          <NumInput field="a" />,
          <>
            <span style={{ fontWeight: 700, color: '#14532d' }}>x −</span>
            <NumInput field="c" width={50} />
          </>
        )}
        <span style={{ fontSize: '1.5rem', fontWeight: 300, color: '#14532d' }}>=</span>
        {fracBlock(
          <NumInput field="d" />,
          <>
            <span style={{ fontWeight: 700, color: '#14532d' }}>x −</span>
            <NumInput field="e" width={50} />
          </>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
        Nhập các hệ số vào các ô (hoặc bấm <strong>Sinh đề mới</strong>), rồi bấm <strong>Giải</strong>. Mẫu chung là $({binLatex(prob.c)})({binLatex(prob.e)})$.
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
