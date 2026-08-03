import { useState } from 'react';

interface Problem {
  text: string;
  answer: string;
  hint?: string;
}

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const round2 = (n: number) => Math.round(n * 100) / 100;
const fmt = (n: number) => n.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');

const generatePractice = (): Problem => {
  const type = randInt(0, 4);
  if (type === 0) {
    const n = randInt(1, 999);
    const d = [10, 100, 1000][randInt(0, 2)];
    return { text: `Viết \\frac{${n}}{${d}} dưới dạng số thập phân`, answer: (n / d).toString().replace('.', ','), hint: `Mẫu ${d} có ${String(d).length - 1} chữ số 0.` };
  } else if (type === 1) {
    const a = round2(randInt(10, 99) / 10);
    const b = round2(randInt(10, 99) / 10);
    return { text: `Tính ${fmt(a)} + ${fmt(b)}`, answer: fmt(round2(a + b)), hint: `Cộng phần thập phân thẳng hàng.` };
  } else if (type === 2) {
    const a = round2(randInt(20, 99) / 10);
    const b = round2(randInt(10, Math.floor(a * 10)) / 10);
    return { text: `Tính ${fmt(a)} - ${fmt(b)}`, answer: fmt(round2(a - b)), hint: `Trừ phần thập phân thẳng hàng.` };
  } else if (type === 3) {
    const n = round2(randInt(100, 9999) / 100);
    const pos = randInt(1, 3);
    const factor = Math.pow(10, pos);
    const result = Math.round(n * factor) / factor;
    return { text: `Làm tròn ${fmt(n)} đến chữ số thập phân thứ ${pos}`, answer: fmt(result), hint: `Xem chữ số ở vị trí thứ ${pos + 1}.` };
  } else {
    const pct = randInt(10, 50);
    const total = randInt(2, 20) * 10;
    const result = Math.round(total * pct / 100);
    return { text: `Tìm ${pct}% của ${total}`, answer: `${result}`, hint: `${pct}% × ${total} = ${result}` };
  }
};

const generateQuick = (): Problem => {
  const a = round2(randInt(10, 50) / 10);
  const b = round2(randInt(10, 50) / 10);
  return { text: `${fmt(a)} ${randInt(0, 1) ? '+' : '-'} ${fmt(b)} = ?`, answer: fmt(round2(randInt(0, 1) ? a + b : a - b)), hint: `Thực hiện phép tính thập phân.` };
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const a = round2(randInt(10, 50) / 10);
    const b = round2(randInt(10, 50) / 10);
    return { text: `${fmt(a)} + x = ${fmt(round2(a + b))}`, answer: fmt(b), hint: `x = ${fmt(round2(a + b))} - ${fmt(a)} = ${fmt(b)}` };
  } else {
    const pct = randInt(10, 50);
    const part = randInt(5, 50);
    const total = Math.round(part / pct * 100);
    return { text: `${pct}% của x = ${part}. Tìm x.`, answer: `${total}`, hint: `x = ${part} ÷ ${pct}% = ${total}` };
  }
};

const generators = [generatePractice, generateQuick, generateFindX];
const tabLabels = ['Luyện tập', 'Nhanh', 'Tìm x'];

export default function OnTapChuong7SoThapPhanInteractive() {
  const [activeTab, setActiveTab] = useState(0);
  const [problems, setProblems] = useState<Problem[]>(generators.map(g => g()));
  const [userAnswers, setUserAnswers] = useState<string[]>(['', '', '']);
  const [showResults, setShowResults] = useState<boolean[]>([false, false, false]);
  const [hints, setHints] = useState<boolean[]>([false, false, false]);
  const [totalAttempts, setTotalAttempts] = useState([0, 0, 0]);
  const [correctCount, setCorrectCount] = useState([0, 0, 0]);

  const refresh = (i: number) => { const np = [...problems]; np[i] = generators[i](); setProblems(np); const na = [...userAnswers]; na[i] = ''; setUserAnswers(na); const ns = [...showResults]; ns[i] = false; setShowResults(ns); const nh = [...hints]; nh[i] = false; setHints(nh); };
  const check = (i: number) => { const ok = userAnswers[i].trim().replace(',', '.') === problems[i].answer.replace(',', '.'); const ns = [...showResults]; ns[i] = true; setShowResults(ns); const na = [...totalAttempts]; na[i]++; setTotalAttempts(na); if (ok) { const nc = [...correctCount]; nc[i]++; setCorrectCount(nc); } return ok; };

  const render = (i: number) => {
    const p = problems[i];
    const ok = showResults[i] ? userAnswers[i].trim().replace(',', '.') === p.answer.replace(',', '.') : null;
    return (
      <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{p.text}</div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" value={userAnswers[i]} onChange={e => { const na = [...userAnswers]; na[i] = e.target.value; setUserAnswers(na); }} onKeyDown={e => { if (e.key === 'Enter') check(i); }} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '2px solid #e2e8f0', fontSize: '1rem', width: 180 }} placeholder="Nhập đáp án..." />
          <button onClick={() => check(i)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: '#2563eb', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Kiểm tra</button>
          <button onClick={() => { const h = [...hints]; h[i] = !h[i]; setHints(h); }} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#fef3c7', border: '1px solid #f59e0b', cursor: 'pointer', fontWeight: 500 }}>💡</button>
          <button onClick={() => refresh(i)} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 500 }}>🔄</button>
        </div>
        {hints[i] && <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fefce8', borderRadius: 8, border: '1px solid #fde047', color: '#854d0e' }}>{p.hint}</div>}
        {showResults[i] && <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: 8, background: ok ? '#dcfce7' : '#fee2e2', border: `1px solid ${ok ? '#22c55e' : '#ef4444'}`, fontWeight: 600 }}>{ok ? '✅ Chính xác!' : `❌ Đáp án đúng: ${p.answer}`}</div>}
      </div>
    );
  };

  return (
    <div style={{ margin: '2rem 0', padding: '1.5rem', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', color: '#1e293b' }}>📝 Ôn tập Chương 7 — Luyện tập tương tác</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {tabLabels.map((l, i) => <button key={l} onClick={() => setActiveTab(i)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: activeTab === i ? '#2563eb' : '#f1f5f9', color: activeTab === i ? 'white' : '#64748b', border: 'none', fontWeight: 600, cursor: 'pointer' }}>{l}</button>)}
      </div>
      {render(activeTab)}
      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '1rem' }}>Đã đúng: {correctCount[activeTab]}/{totalAttempts[activeTab]}</div>
    </div>
  );
}
