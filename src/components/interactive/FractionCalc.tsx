import { useState } from 'react';
import { gcd } from 'mathjs';

interface Props { operation?: 'add' | 'subtract' | 'multiply' | 'divide' }

export default function FractionCalc({ operation = 'add' }: Props) {
  const [n1, setN1] = useState(1), [d1, setD1] = useState(2);
  const [n2, setN2] = useState(1), [d2, setD2] = useState(3);
  const [op, setOp] = useState<'add'|'subtract'|'multiply'|'divide'>(operation);
  const [showSteps, setShowSteps] = useState(false);

  const compute = () => {
    let rn = 0, rd = 1;
    if (op === 'add')      { rn = n1*d2 + n2*d1; rd = d1*d2; }
    if (op === 'subtract') { rn = n1*d2 - n2*d1; rd = d1*d2; }
    if (op === 'multiply') { rn = n1*n2; rd = d1*d2; }
    if (op === 'divide')   { rn = n1*d2; rd = d1*n2; }
    const g = Math.abs(Number(gcd(rn, rd)));
    return { rn: rn/g, rd: rd/g, rawN: rn, rawD: rd, g };
  };

  const result = compute();
  const sym = { add:'+', subtract:'−', multiply:'×', divide:'÷' }[op];

  return (
    <div>
      <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {(['add','subtract','multiply','divide'] as const).map(o => (
          <button key={o} className={`btn btn-sm ${op===o?'btn-primary':'btn-secondary'}`} onClick={() => setOp(o)}>
            {{ add:'+ Cộng', subtract:'− Trừ', multiply:'× Nhân', divide:'÷ Chia' }[o]}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        {/* Frac 1 */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.3rem' }}>
          <input type="number" value={n1} onChange={e => setN1(Number(e.target.value))}
            style={{ width:'70px', padding:'.4rem', border:'2px solid #93c5fd', borderRadius:'8px', textAlign:'center', fontSize:'1.1rem', fontWeight:700 }} />
          <div style={{ width:'70px', height:'3px', background:'#1e293b', borderRadius:'99px' }} />
          <input type="number" min={1} value={d1} onChange={e => setD1(Math.max(1,Number(e.target.value)))}
            style={{ width:'70px', padding:'.4rem', border:'2px solid #93c5fd', borderRadius:'8px', textAlign:'center', fontSize:'1.1rem', fontWeight:700 }} />
        </div>

        <span style={{ fontSize:'2rem', fontWeight:800, color:'#6366f1' }}>{sym}</span>

        {/* Frac 2 */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.3rem' }}>
          <input type="number" value={n2} onChange={e => setN2(Number(e.target.value))}
            style={{ width:'70px', padding:'.4rem', border:'2px solid #6ee7b7', borderRadius:'8px', textAlign:'center', fontSize:'1.1rem', fontWeight:700 }} />
          <div style={{ width:'70px', height:'3px', background:'#1e293b', borderRadius:'99px' }} />
          <input type="number" min={1} value={d2} onChange={e => setD2(Math.max(1,Number(e.target.value)))}
            style={{ width:'70px', padding:'.4rem', border:'2px solid #6ee7b7', borderRadius:'8px', textAlign:'center', fontSize:'1.1rem', fontWeight:700 }} />
        </div>

        <span style={{ fontSize:'2rem', fontWeight:800 }}>=</span>

        <div style={{ padding:'.75rem 1.25rem', background:'#eff6ff', border:'2px solid #93c5fd', borderRadius:'12px' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', fontSize:'1.5rem', fontWeight:800 }}>
            <span style={{ color:'#2563eb' }}>{result.rn}</span>
            <div style={{ width:'50px', height:'2.5px', background:'#1e293b', margin:'3px 0', borderRadius:'99px' }} />
            <span>{result.rd}</span>
          </div>
        </div>
      </div>

      <button className="btn btn-secondary btn-sm" onClick={() => setShowSteps(!showSteps)}>
        {showSteps ? '🔼 Ẩn bước giải' : '🔽 Xem bước giải'}
      </button>

      {showSteps && (
        <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'1.25rem', marginTop:'.75rem' }}>
          <h4 style={{ marginBottom:'.75rem' }}>📝 Các bước:</h4>
          <ol style={{ paddingLeft:'1.5rem', display:'flex', flexDirection:'column', gap:'.5rem', fontSize:'.9rem' }}>
            {(op==='add'||op==='subtract') && <>
              <li>Mẫu chung: <strong>{d1} × {d2} = {d1*d2}</strong></li>
              <li>Quy đồng: <code style={{background:'#dbeafe',padding:'2px 6px',borderRadius:'4px'}}>{n1}/{d1} {sym} {n2}/{d2} = {n1*d2}/{d1*d2} {sym} {n2*d1}/{d1*d2}</code></li>
              <li>Tính: <strong>{n1*d2} {sym} {n2*d1} = {result.rawN}</strong></li>
              {result.g>1 && <li>Rút gọn (÷{result.g}): <strong style={{color:'#2563eb'}}>{result.rn}/{result.rd}</strong></li>}
            </>}
            {op==='multiply' && <>
              <li>Tử × tử = <strong>{n1} × {n2} = {n1*n2}</strong></li>
              <li>Mẫu × mẫu = <strong>{d1} × {d2} = {d1*d2}</strong></li>
              {result.g>1 && <li>Rút gọn (÷{result.g}): <strong style={{color:'#2563eb'}}>{result.rn}/{result.rd}</strong></li>}
            </>}
            {op==='divide' && <>
              <li>Lấy nghịch đảo phân số 2: <code style={{background:'#dbeafe',padding:'2px 6px',borderRadius:'4px'}}>{n2}/{d2} → {d2}/{n2}</code></li>
              <li>Nhân: <code style={{background:'#dbeafe',padding:'2px 6px',borderRadius:'4px'}}>{n1}/{d1} × {d2}/{n2} = {n1*d2}/{d1*n2}</code></li>
              {result.g>1 && <li>Rút gọn (÷{result.g}): <strong style={{color:'#2563eb'}}>{result.rn}/{result.rd}</strong></li>}
            </>}
            <li>✅ Kết quả: <strong style={{color:'#2563eb',fontSize:'1.1rem'}}>{result.rn}/{result.rd}</strong></li>
          </ol>
        </div>
      )}
    </div>
  );
}
