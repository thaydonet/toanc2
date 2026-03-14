import { useState, useEffect, useRef } from 'react';
import katex from 'katex';

interface Term {
  coeff: number;
  var: string;
  exp: number;
}

function parseTerm(str: string): Term[] {
  if (!str.trim()) return [];
  const terms: Term[] = [];
  const cleaned = str.replace(/\s+/g, '').replace(/-/g, '+-');
  const parts = cleaned.split('+').filter(p => p);
  
  for (const part of parts) {
    const match = part.match(/^(-?\d*)?([a-z])(\^(\d+))?$/);
    if (match) {
      const coeff = match[1] ? (match[1] === '-' ? -1 : parseInt(match[1])) : 1;
      const variable = match[2] || '';
      const exponent = match[4] ? parseInt(match[4]) : (variable ? 1 : 0);
      terms.push({ coeff, var: variable, exp: exponent });
    } else if (!isNaN(Number(part))) {
      terms.push({ coeff: Number(part), var: '', exp: 0 });
    }
  }
  return terms;
}

function parseDenominator(str: string): Term[] {
  if (!str.trim()) return [];
  const factors: Term[] = [];
  const parts = str.split(/[*(]/).filter(p => p.trim());
  
  for (const part of parts) {
    const cleaned = part.replace(/[)]/g, '').trim();
    const match = cleaned.match(/^(-?\d+)?([a-z])(\^(\d+))?$/);
    if (match) {
      const coeff = match[1] ? parseInt(match[1]) : 1;
      const variable = match[2] || '';
      const exponent = match[4] ? parseInt(match[4]) : (variable ? 1 : 0);
      if (variable || coeff) {
        factors.push({ coeff, var: variable, exp: exponent });
      }
    }
  }
  
  if (factors.length === 0) {
    const numMatch = str.match(/^(-?\d+)$/);
    if (numMatch) {
      factors.push({ coeff: parseInt(numMatch[1]), var: '', exp: 0 });
    }
  }
  
  return factors;
}

function stringifyTerm(t: Term): string {
  if (t.exp === 0) return t.coeff.toString();
  if (t.coeff === 1) return t.var + (t.exp > 1 ? `^${t.exp}` : '');
  if (t.coeff === -1) return '-' + t.var + (t.exp > 1 ? `^${t.exp}` : '');
  return t.coeff + t.var + (t.exp > 1 ? `^${t.exp}` : '');
}

function stringifyDenom(terms: Term[]): string {
  if (terms.length === 0) return '1';
  return terms.map((t, i) => {
    const part = t.exp === 0 ? t.coeff.toString() : (t.var + (t.exp > 1 ? `^${t.exp}` : ''));
    return i === 0 ? part : `·${part}`;
  }).join('');
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

function multiplyTerm(terms: Term[], mult: Term[]): Term[] {
  if (mult.length === 1 && mult[0].exp === 0 && mult[0].var === '') return terms;
  
  const result: Term[] = [];
  for (const t of terms) {
    for (const m of mult) {
      if (m.var === t.var) {
        result.push({ coeff: t.coeff, var: t.var, exp: t.exp + m.exp });
      } else if (m.var === '') {
        result.push({ coeff: t.coeff * m.coeff, var: t.var, exp: t.exp });
      } else if (t.var === '') {
        result.push({ coeff: t.coeff * m.coeff, var: m.var, exp: m.exp });
      }
    }
  }
  return result.length > 0 ? result : terms;
}

interface Step {
  title: string;
  content: string;
}

export default function FractionDenominatorLCM() {
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('x-1');
  const [num2, setNum2] = useState('1');
  const [den2, setDen2] = useState('x+1');
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
    
    newSteps.push({
      title: 'Bước 1: Xác định các mẫu',
      content: `\\frac{${num1}}{${den1}} \\quad \\text{và} \\quad \\frac{${num2}}{${den2}}`
    });
    
    newSteps.push({
      title: 'Bước 2: Phân tích các mẫu thành nhân tử',
      content: `\\text{Mẫu 1: } ${stringifyDenom(d1)} = ${den1} \\\\ \\text{Mẫu 2: } ${stringifyDenom(d2)} = ${den2}`
    });
    
    const lcm = findLCM(d1, d2);
    const lcmStr = stringifyDenom(lcm);
    
    newSteps.push({
      title: 'Bước 3: Tìm Mẫu Thức Chung (MTC)',
      content: `\\text{MTC} = ${lcmStr}`
    });
    
    const mult1 = getMultiplier(lcm, d1);
    const mult2 = getMultiplier(lcm, d2);
    
    newSteps.push({
      title: 'Bước 4: Tìm nhân tử phụ',
      content: `\\text{Nhân tử phụ 1: } ${stringifyDenom(mult1)} \\\\ \\text{Nhân tử phụ 2: } ${stringifyDenom(mult2)}`
    });
    
    newSteps.push({
      title: 'Bước 5: Quy đồng mẫu thức',
      content: `\\frac{${num1} \\cdot ${stringifyDenom(mult1)}}{${den1} \\cdot ${stringifyDenom(mult1)}} = \\frac{${num1} \\cdot ${stringifyDenom(mult1)}}{${lcmStr}} \\\\ \\frac{${num2} \\cdot ${stringifyDenom(mult2)}}{${den2} \\cdot ${stringifyDenom(mult2)}} = \\frac{${num2} \\cdot ${stringifyDenom(mult2)}}{${lcmStr}}`
    });
    
    setSteps(newSteps);
  };

  useEffect(() => {
    calculate();
  }, [num1, den1, num2, den2]);

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
    <div style={{ padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '2px solid #86efac', margin: '1.5rem 0' }}>
      <h3 style={{ margin: '0 0 1.5rem', color: '#14532d', fontSize: '1.2rem' }}>🔍 Thực hành: Tìm Mẫu Thức Chung (MTC)</h3>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <input
            type="text"
            value={num1}
            onChange={e => setNum1(e.target.value)}
            style={{ width: '60px', padding: '6px', border: '2px solid #86efac', borderRadius: '6px', textAlign: 'center', marginBottom: '4px' }}
          />
          <div style={{ borderTop: '2px solid #334155', width: '60px', margin: '0 auto' }} />
          <input
            type="text"
            value={den1}
            onChange={e => setDen1(e.target.value)}
            placeholder="Mẫu 1"
            style={{ width: '80px', padding: '6px', border: '2px solid #86efac', borderRadius: '6px', textAlign: 'center' }}
          />
        </div>
        
        <span style={{ fontSize: '1.2rem', color: '#64748b' }}>và</span>
        
        <div style={{ textAlign: 'center' }}>
          <input
            type="text"
            value={num2}
            onChange={e => setNum2(e.target.value)}
            style={{ width: '60px', padding: '6px', border: '2px solid #86efac', borderRadius: '6px', textAlign: 'center', marginBottom: '4px' }}
          />
          <div style={{ borderTop: '2px solid #334155', width: '60px', margin: '0 auto' }} />
          <input
            type="text"
            value={den2}
            onChange={e => setDen2(e.target.value)}
            placeholder="Mẫu 2"
            style={{ width: '80px', padding: '6px', border: '2px solid #86efac', borderRadius: '6px', textAlign: 'center' }}
          />
        </div>
      </div>

      <div ref={containerRef}>
        {steps.map((step, i) => (
          <div key={i} style={{ marginBottom: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '0.9rem', color: '#166534', marginBottom: '0.5rem', fontWeight: 600 }}>{step.title}</div>
            <div className="math-render" style={{ textAlign: 'center', fontSize: '1rem', color: '#1e293b' }}>{step.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
