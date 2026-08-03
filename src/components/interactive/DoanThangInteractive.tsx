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
    const ab = randInt(5, 30);
    const m = randInt(1, ab - 1);
    return { text: `Cho đoạn thẳng AB = ${ab}cm. Điểm M nằm giữa A và B, AM = ${m}cm. Tính MB.`, answer: `${ab - m}`, hint: `MB = AB - AM = ${ab} - ${m} = ${ab - m}` };
  } else if (type === 1) {
    const n = randInt(2, 6);
    return { text: `${n} điểm phân biệt trên đường thẳng, tạo thành bao nhiêu đoạn thẳng?`, answer: `${n * (n - 1) / 2}`, hint: `Số đoạn thẳng = n(n-1)/2 = ${n}×${n-1}/2 = ${n * (n - 1) / 2}` };
  } else {
    const total = randInt(10, 30);
    const ratio1 = randInt(1, 4);
    const ratio2 = randInt(1, 4);
    const sum = ratio1 + ratio2;
    const part1 = Math.round(total * ratio1 / sum);
    return { text: `Đoạn thẳng AB = ${total}cm, điểm M nằm giữa. AM:MB = ${ratio1}:${ratio2}. Tính AM.`, answer: `${part1}`, hint: `AM = ${total} × ${ratio1}/(${ratio1}+${ratio2}) = ${total} × ${ratio1}/${sum} = ${part1}` };
  }
};

const generateQuick = (): Problem => {
  const ab = randInt(10, 50);
  const m = randInt(2, ab - 2);
  return { text: `AB = ${ab}cm, M giữa. AM = ?`, answer: `${ab / 2}`, hint: `M là trung điểm → AM = AB/2 = ${ab / 2}` };
};

const generateFindX = (): Problem => {
  const total = randInt(10, 40);
  const part = randInt(3, total - 3);
  return { text: `AB = ${total}cm, M giữa A và B. AM = x cm, MB = ${part}cm. Nhưng M KHÔNG phải trung điểm. x = ?`, answer: `${total - part}`, hint: `M không phải trung điểm → AM ≠ MB. x = AB - MB = ${total} - ${part} = ${total - part}` };
};

const generators = [generatePractice, generateQuick, generateFindX];
const tabLabels = ['Luyện tập', 'Nhanh', 'Tìm x'];

export default function DoanThangInteractive() {
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
      <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', color: '#1e293b' }}>📏 Đoạn thẳng — Luyện tập tương tác</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {tabLabels.map((l, i) => <button key={l} onClick={() => setActiveTab(i)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: activeTab === i ? '#2563eb' : '#f1f5f9', color: activeTab === i ? 'white' : '#64748b', border: 'none', fontWeight: 600, cursor: 'pointer' }}>{l}</button>)}
      </div>
      {render(activeTab)}
      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '1rem' }}>Đã đúng: {correctCount[activeTab]}/{totalAttempts[activeTab]}</div>
    </div>
  );
}
