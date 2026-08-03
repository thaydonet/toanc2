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
  const type = randInt(0, 3);
  if (type === 0) {
    const a = round2(randInt(10, 99) / 10);
    const b = round2(randInt(10, 99) / 10);
    return { text: `Tính ${fmt(a)} + ${fmt(b)}`, answer: fmt(round2(a + b)), hint: `Cộng phần thập phân thẳng hàng.` };
  } else if (type === 1) {
    const a = round2(randInt(20, 99) / 10);
    const b = round2(randInt(10, Math.floor(a * 10)) / 10);
    return { text: `Tính ${fmt(a)} - ${fmt(b)}`, answer: fmt(round2(a - b)), hint: `Trừ phần thập phân thẳng hàng.` };
  } else if (type === 2) {
    const a = round2(randInt(10, 50) / 10);
    const b = randInt(2, 9);
    return { text: `Tính ${fmt(a)} × ${b}`, answer: fmt(round2(a * b)), hint: `Nhân như số tự nhiên, đếm tổng số chữ số thập phân.` };
  } else {
    const b = round2(randInt(20, 50) / 10);
    const result = randInt(2, 10);
    const a = round2(b * result);
    return { text: `Tính ${fmt(a)} ÷ ${fmt(b)}`, answer: fmt(result), hint: `Chuyển cả hai thành số nguyên: ${fmt(a)} × 10 ÷ (${fmt(b)} × 10) = ${a * 10} ÷ ${b * 10}.` };
  }
};

const generateQuick = (): Problem => {
  const a = round2(randInt(10, 50) / 10);
  const b = round2(randInt(10, 50) / 10);
  return { text: `${fmt(a)} + ${fmt(b)}${randInt(0, 1) ? '' : ' × ' + randInt(2, 5)}`, answer: fmt(round2(a + b)), hint: `Tính theo thứ tự ưu tiên.` };
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const a = round2(randInt(10, 50) / 10);
    const b = round2(randInt(10, 50) / 10);
    return { text: `${fmt(a)} + x = ${fmt(round2(a + b))}`, answer: fmt(b), hint: `x = ${fmt(round2(a + b))} - ${fmt(a)} = ${fmt(b)}` };
  } else {
    const a = round2(randInt(20, 80) / 10);
    const b = round2(randInt(10, Math.floor(a)) / 10);
    return { text: `x - ${fmt(b)} = ${fmt(round2(a - b))}`, answer: fmt(a), hint: `x = ${fmt(round2(a - b))} + ${fmt(b)} = ${fmt(a)}` };
  }
};

const generators = [generatePractice, generateQuick, generateFindX];
const tabLabels = ['Luyện tập', 'Nhanh', 'Tìm x'];

export default function TinhToanSoThapPhanInteractive() {
  const [activeTab, setActiveTab] = useState(0);
  const [problems, setProblems] = useState<Problem[]>(generators.map(g => g()));
  const [userAnswers, setUserAnswers] = useState<string[]>(['', '', '']);
  const [showResults, setShowResults] = useState<boolean[]>([false, false, false]);
  const [hints, setHints] = useState<boolean[]>([false, false, false]);
  const [totalAttempts, setTotalAttempts] = useState([0, 0, 0]);
  const [correctCount, setCorrectCount] = useState([0, 0, 0]);

  const refreshProblem = (idx: number) => {
    const np = [...problems]; np[idx] = generators[idx](); setProblems(np);
    const na = [...userAnswers]; na[idx] = ''; setUserAnswers(na);
    const ns = [...showResults]; ns[idx] = false; setShowResults(ns);
    const nh = [...hints]; nh[idx] = false; setHints(nh);
  };

  const checkAnswer = (idx: number) => {
    const isCorrect = userAnswers[idx].trim().replace(',', '.') === problems[idx].answer.replace(',', '.');
    const ns = [...showResults]; ns[idx] = true; setShowResults(ns);
    const na = [...totalAttempts]; na[idx]++; setTotalAttempts(na);
    if (isCorrect) { const nc = [...correctCount]; nc[idx]++; setCorrectCount(nc); }
    return isCorrect;
  };

  const renderProblem = (idx: number) => {
    const p = problems[idx];
    const isCorrect = showResults[idx] ? (userAnswers[idx].trim().replace(',', '.') === p.answer.replace(',', '.')) : null;
    return (
      <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>{p.text}</div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" value={userAnswers[idx]} onChange={e => { const na = [...userAnswers]; na[idx] = e.target.value; setUserAnswers(na); }} onKeyDown={e => { if (e.key === 'Enter') checkAnswer(idx); }} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '2px solid #e2e8f0', fontSize: '1rem', width: 180 }} placeholder="Nhập đáp án..." />
          <button onClick={() => checkAnswer(idx)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: '#2563eb', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Kiểm tra</button>
          <button onClick={() => { const h = [...hints]; h[idx] = !h[idx]; setHints(h); }} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#fef3c7', border: '1px solid #f59e0b', cursor: 'pointer', fontWeight: 500 }}>💡 Gợi ý</button>
          <button onClick={() => refreshProblem(idx)} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 500 }}>🔄</button>
        </div>
        {hints[idx] && <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fefce8', borderRadius: 8, border: '1px solid #fde047', color: '#854d0e' }}>{p.hint}</div>}
        {showResults[idx] && <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: 8, background: isCorrect ? '#dcfce7' : '#fee2e2', border: `1px solid ${isCorrect ? '#22c55e' : '#ef4444'}`, fontWeight: 600 }}>{isCorrect ? '✅ Chính xác!' : `❌ Đáp án đúng: ${p.answer}`}</div>}
      </div>
    );
  };

  return (
    <div style={{ margin: '2rem 0', padding: '1.5rem', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', color: '#1e293b' }}>🔢 Tính toán số thập phân — Luyện tập tương tác</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {tabLabels.map((l, i) => <button key={l} onClick={() => setActiveTab(i)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: activeTab === i ? '#2563eb' : '#f1f5f9', color: activeTab === i ? 'white' : '#64748b', border: 'none', fontWeight: 600, cursor: 'pointer' }}>{l}</button>)}
      </div>
      {renderProblem(activeTab)}
      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '1rem' }}>Đã đúng: {correctCount[activeTab]}/{totalAttempts[activeTab]}</div>
    </div>
  );
}
