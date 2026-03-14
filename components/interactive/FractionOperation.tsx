import { useState, useEffect, useRef } from 'react';
import katex from 'katex';

interface Term {
  coeff: number;
  var: string;
  exp: number;
}

function parseDenominator(str: string): Term[] {
  if (!str.trim()) return [];
  const factors: Term[] = [];
  const cleaned = str.replace(/\s+/g, '').replace(/[*]/g, '');
  
  const factorParts = cleaned.split(/[)(]/).filter(p => p);
  
  for (const part of factorParts) {
    if (!part) continue;
    const match = part.match(/^(-?\d+)?([a-z])(\^(\d+))?$/);
    if (match) {
      const coeff = match[1] ? parseInt(match[1]) : 1;
      const variable = match[2] || '';
      const exponent = match[4] ? parseInt(match[4]) : (variable ? 1 : 0);
      if (variable || coeff) {
        factors.push({ coeff, var: variable, exp: exponent });
      }
    } else if (!isNaN(Number(part))) {
      factors.push({ coeff: Number(part), var: '', exp: 0 });
    }
  }
  
  return factors;
}

function stringifyDenom(terms: Term[]): string {
  if (terms.length === 0) return '1';
  return terms.map((t, i) => {
    const part = t.exp === 0 ? Math.abs(t.coeff).toString() : (t.var + (t.exp > 1 ? `^${t.exp}` : ''));
    const sign = i === 0 || t.coeff >= 0 ? '' : '-';
    return sign + part;
  }).join('·');
}

function findLCM(denom1: Term[], denom2: Term[]): Term[] {
  const result: Term[] = [];
  
  for (const d1 of denom1) {
    const existing = result.find(r => r.var === d1.var);
    if (existing) {
      if (d1.exp > existing.exp) existing.exp = d1.exp;
    } else {
      result.push({ coeff: 1, var: d1.var, exp: d1.exp });
    }
  }
  
  for (const d2 of denom2) {
    if (!result.find(r => r.var === d2.var)) {
      result.push({ coeff: 1, var: d2.var, exp: d2.exp });
    }
  }
  
  return result;
}

function getMultiplier(mtc: Term[], denom: Term[]): Term[] {
  const result: Term[] = [];
  
  for (const m of mtc) {
    const d = denom.find(x => x.var === m.var);
    if (!d || m.exp > d.exp) {
      result.push({ coeff: 1, var: m.var, exp: m.exp - (d?.exp || 0) });
    }
  }
  
  if (result.length === 0) return [{ coeff: 1, var: '', exp: 0 }];
  return result;
}

function multiplyTermWithNumber(numStr: string, mult: Term[]): string {
  if (mult.length === 1 && mult[0].exp === 0 && mult[0].var === '') {
    const multVal = mult[0].coeff;
    const n = parseInt(numStr) || 0;
    return (n * multVal).toString();
  }
  
  const multStr = mult.map(m => m.var + (m.exp > 1 ? `^${m.exp}` : '')).join('·');
  return `${numStr}·${multStr}`;
}

interface Step {
  title: string;
  content: string;
}

export default function FractionOperation() {
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('x');
  const [num2, setNum2] = useState('2');
  const [den2, setDen2] = useState('x+1');
  const [operation, setOperation] = useState<'+' | '-'>('+');
  const [steps, setSteps] = useState<Step[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    const d1 = parseDenominator(den1);
    const d2 = parseDenominator(den2);
    
    if (d1.length === 0 || d2.length === 0) {
      setSteps([]);
      return;
    }
    
    const newSteps: Step[] = [];
    const opSymbol = operation === '+' ? '+' : '-';
    
    newSteps.push({
      title: 'Bước 1: Xác định phép tính',
      content: `\\frac{${num1}}{${den1}} ${opSymbol} \\frac{${num2}}{${den2}}`
    });
    
    const lcm = findLCM(d1, d2);
    const lcmStr = stringifyDenom(lcm);
    
    newSteps.push({
      title: 'Bước 2: Tìm Mẫu Thức Chung (MTC)',
      content: `\\text{MTC} = ${lcmStr}`
    });
    
    const mult1 = getMultiplier(lcm, d1);
    const mult2 = getMultiplier(lcm, d2);
    
    const newNum1 = multiplyTermWithNumber(num1, mult1);
    const newNum2 = multiplyTermWithNumber(num2, mult2);
    
    newSteps.push({
      title: 'Bước 3: Quy đồng mẫu thức',
      content: `\\frac{${num1}}{${den1}} = \\frac{${newNum1}}{${lcmStr}} \\\\ \\frac{${num2}}{${den2}} = \\frac{${newNum2}}{${lcmStr}}`
    });
    
    let combinedNum: string;
    if (operation === '+') {
      combinedNum = `(${newNum1}) + (${newNum2})`;
    } else {
      combinedNum = `(${newNum1}) - (${newNum2})`;
    }
    
    newSteps.push({
      title: `Bước 4: ${operation === '+' ? 'Cộng' : 'Trừ'} các tử thức`,
      content: `\\frac{${newNum1}}{${lcmStr}} ${opSymbol} \\frac{${newNum2}}{${lcmStr}} = \\frac{${combinedNum}}{${lcmStr}}`
    });
    
    newSteps.push({
      title: 'Bước 5: Kết quả',
      content: `\\frac{${num1}}{${den1}} ${opSymbol} \\frac{${num2}}{${den2}} = \\frac{${combinedNum}}{${lcmStr}}`
    });
    
    setSteps(newSteps);
  };

  useEffect(() => {
    calculate();
  }, [num1, den1, num2, den2, operation]);

  useEffect(() => {
    if (!containerRef.current) return;
    const timer = setTimeout(() => {
      containerRef.current?.querySelectorAll('.math-render').forEach((el) => {
        const span = el as HTMLElement;
        if (span.dataset.rendered !== 'true') {
          katex.render(span.textContent || '', span, {
            displayMode: true,
            throwOnError: false,
          });
          span.dataset.rendered = 'true';
        }
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [steps]);

  return (
    <div style={{ padding: '1.5rem', background: '#f0f9ff', borderRadius: '12px', border: '2px solid #7dd3fc', margin: '1.5rem 0' }}>
      <h3 style={{ margin: '0 0 1.5rem', color: '#0c4a6e', fontSize: '1.2rem' }}>➕➖ Thực hành: Cộng trừ phân thức đại số</h3>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <input
            type="text"
            value={num1}
            onChange={e => setNum1(e.target.value)}
            placeholder="Tử 1"
            style={{ width: '70px', padding: '8px', border: '2px solid #7dd3fc', borderRadius: '6px', textAlign: 'center', marginBottom: '4px', fontSize: '0.95rem' }}
          />
          <div style={{ borderTop: '2px solid #334155', width: '70px', margin: '0 auto' }} />
          <input
            type="text"
            value={den1}
            onChange={e => setDen1(e.target.value)}
            placeholder="Mẫu 1"
            style={{ width: '90px', padding: '8px', border: '2px solid #7dd3fc', borderRadius: '6px', textAlign: 'center', fontSize: '0.95rem' }}
          />
        </div>
        
        <button
          onClick={() => setOperation(op => op === '+' ? '-' : '+')}
          style={{
            padding: '10px 18px',
            background: operation === '+' ? '#22c55e' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            minWidth: '50px'
          }}
        >
          {operation}
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <input
            type="text"
            value={num2}
            onChange={e => setNum2(e.target.value)}
            placeholder="Tử 2"
            style={{ width: '70px', padding: '8px', border: '2px solid #7dd3fc', borderRadius: '6px', textAlign: 'center', marginBottom: '4px', fontSize: '0.95rem' }}
          />
          <div style={{ borderTop: '2px solid #334155', width: '70px', margin: '0 auto' }} />
          <input
            type="text"
            value={den2}
            onChange={e => setDen2(e.target.value)}
            placeholder="Mẫu 2"
            style={{ width: '90px', padding: '8px', border: '2px solid #7dd3fc', borderRadius: '6px', textAlign: 'center', fontSize: '0.95rem' }}
          />
        </div>
      </div>

      <div ref={containerRef}>
        {steps.map((step, i) => (
          <div key={i} style={{ marginBottom: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: '0.9rem', color: '#0369a1', marginBottom: '0.5rem', fontWeight: 600 }}>{step.title}</div>
            <div className="math-render" style={{ textAlign: 'center', fontSize: '1rem', color: '#1e293b' }}>{step.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
