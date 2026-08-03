import { useState } from 'react';

interface Problem {
  text: string;
  answer: string;
  hint?: string;
}

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generatePractice = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const items = ['Táo', 'Chuối', 'Cam'];
    const counts = [randInt(3, 12), randInt(3, 12), randInt(3, 12)];
    const maxIdx = counts.indexOf(Math.max(...counts));
    return { text: `Biểu đồ cột: Táo=${counts[0]}, Chuối=${counts[1]}, Cam=${counts[2]}. Loài nào nhiều nhất?`, answer: items[maxIdx], hint: `So sánh ${counts[0]}, ${counts[1]}, ${counts[2]}` };
  } else if (type === 1) {
    const a = randInt(5, 15);
    const b = randInt(5, 15);
    const total = a + b;
    const rate = Math.round(a / total * 100);
    return { text: `Tổng ${total}, A=${a}, B=${b}. A chiếm bao nhiêu %?`, answer: `${rate}%`, hint: `${a}/${total} × 100% = ${rate}%` };
  } else {
    const vals = Array.from({ length: 4 }, () => randInt(5, 20));
    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / vals.length);
    return { text: `4 cột: ${vals.join(', ')}. Trung bình = ?`, answer: `${avg}`, hint: `(${vals.join(' + ')}) / 4 = ${sum} / 4 = ${avg}` };
  }
};

const generateQuick = (): Problem => {
  const a = randInt(10, 30);
  const b = randInt(10, 30);
  return { text: `A=${a}, B=${b}. A-B = ?`, answer: `${a - b}`, hint: `${a} - ${b} = ${a - b}` };
};

const generateFindX = (): Problem => {
  const total = randInt(40, 80);
  const a = randInt(10, total - 20);
  const b = total - a - randInt(5, total - a - 5);
  return { text: `Tổng=${total}, A=${a}, B=x. A+B = ${a + b}. Tìm x.`, answer: `${b}`, hint: `x = ${a + b} - ${a} = ${b}` };
};

const generators = [generatePractice, generateQuick, generateFindX];
const tabLabels = ['Luyện tập', 'Nhanh', 'Tìm x'];

export default function BieuDoCotInteractive() {
  const [activeTab, setActiveTab] = useState(0);
  const [problems, setProblems] = useState<Problem[]>(generators.map(g => g()));
  const [userAnswers, setUserAnswers] = useState<string[]>(['', '', '']);
  const [showResults, setShowResults] = useState<boolean[]>([false, false, false]);
  const [hints, setHints] = useState<boolean[]>([false, false, false]);
  const [totalAttempts, setTotalAttempts] = useState([0, 0, 0]);
  const [correctCount, setCorrectCount] = useState([0, 0, 0]);

  const refresh = (i: number) => { const np = [...problems]; np[i] = generators[i](); setProblems(np); const na = [...userAnswers]; na[i] = ''; setUserAnswers(na); const ns = [...showResults]; ns[i] = false; setShowResults(ns); const nh = [...hints]; nh[i] = false; setHints(nh); };
  const check = (i: number) => { const ok = userAnswers[i].trim() === problems[i].answer; const ns = [...showResults]; ns[i] = true; setShowResults(ns); const na = [...totalAttempts]; na[i]++; setTotalAttempts(na); if (ok) { const nc = [...correctCount]; nc[i]++; setCorrectCount(nc); } return ok; };

  const render = (i: number) => {
    const p = problems[i];
    const ok = showResults[i] ? userAnswers[i].trim() === p.answer : null;
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
      <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', color: '#1e293b' }}>📊 Biểu đồ cột — Luyện tập tương tác</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {tabLabels.map((l, i) => <button key={l} onClick={() => setActiveTab(i)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: activeTab === i ? '#2563eb' : '#f1f5f9', color: activeTab === i ? 'white' : '#64748b', border: 'none', fontWeight: 600, cursor: 'pointer' }}>{l}</button>)}
      </div>
      {render(activeTab)}
      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '1rem' }}>Đã đúng: {correctCount[activeTab]}/{totalAttempts[activeTab]}</div>
    </div>
  );
}
