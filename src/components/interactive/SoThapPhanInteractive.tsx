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
    const n = randInt(1, 999);
    const d = [10, 100, 1000][randInt(0, 2)];
    return {
      text: `Viết \\frac{${n}}{${d}} dưới dạng số thập phân`,
      answer: (n / d).toString().replace('.', ','),
      hint: `Mẫu ${d} có ${String(d).length - 1} chữ số 0, dịch dấu phẩy sang trái ${String(d).length - 1} chữ số.`,
    };
  } else if (type === 1) {
    const intPart = randInt(0, 50);
    const decPart = randInt(1, 99);
    const numStr = `${intPart}${decPart}`.replace(/^0+/, '') || '0';
    const d = [10, 100][randInt(0, 1)];
    return {
      text: `Viết ${intPart},${decPart < 10 ? '0' + decPart : decPart} dưới dạng phân số`,
      answer: `${intPart * 100 + decPart}/${intPart === 0 ? 100 : 100}`,
      hint: `Sau dấu phẩy có ${decPart < 10 ? 1 : 2} chữ số, nên mẫu là ${decPart < 10 ? 10 : 100}.`,
    };
  } else {
    const n = randInt(-50, 50);
    return {
      text: `Tìm số đối của ${n}`,
      answer: `${-n}`,
      hint: `Số đối của a là -a sao cho a + (-a) = 0.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const a = randInt(10, 99);
    const b = randInt(10, 99);
    const aDec = a / 10;
    const bDec = b / 10;
    return {
      text: `So sánh ${aDec.toString().replace('.', ',')} và ${bDec.toString().replace('.', ',')}`,
      answer: a > b ? '>' : a < b ? '<' : '=',
      hint: `So sánh phần nguyên trước: ${Math.floor(aDec)} và ${Math.floor(bDec)}.`,
    };
  } else {
    const nums = [randInt(-50, 50), randInt(-50, 50), randInt(-50, 50)].map(n => n / 10);
    const sorted = [...nums].sort((a, b) => a - b);
    return {
      text: `Sắp xếp tăng dần: ${nums.map(n => n.toString().replace('.', ',')).join('; ')}`,
      answer: sorted.map(n => n.toString().replace('.', ',')).join(', '),
      hint: `Sắp xếp từ số âm lớn nhất đến số dương lớn nhất.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const a = randInt(1, 20);
    const b = randInt(1, 20);
    return {
      text: `${a} + x = ${a + b} (x là số thập phân)`,
      answer: `${b}`,
      hint: `x = ${a + b} - ${a} = ${b}`,
    };
  } else {
    const a = randInt(5, 30);
    const b = randInt(1, a - 1);
    return {
      text: `x - ${b} = ${a - b} (x là số thập phân)`,
      answer: `${a}`,
      hint: `x = ${a - b} + ${b} = ${a}`,
    };
  }
};

const generators = [generatePractice, generateQuick, generateFindX];
const tabLabels = ['Luyện tập', 'Nhanh', 'Tìm x'];
const tabKeys = ['practice', 'quick', 'findX'] as const;

export default function SoThapPhan6Interactive() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [problems, setProblems] = useState<Problem[]>(generators.map(g => g()));
  const [userAnswers, setUserAnswers] = useState<string[]>(['', '', '']);
  const [showResults, setShowResults] = useState<boolean[]>([false, false, false]);
  const [scores, setScores] = useState([0, 0, 0]);
  const [hints, setHints] = useState<boolean[]>([false, false, false]);
  const [totalAttempts, setTotalAttempts] = useState([0, 0, 0]);
  const [correctCount, setCorrectCount] = useState([0, 0, 0]);

  const refreshProblem = (idx: number) => {
    const newProblems = [...problems];
    newProblems[idx] = generators[idx]();
    setProblems(newProblems);
    const newAnswers = [...userAnswers];
    newAnswers[idx] = '';
    setUserAnswers(newAnswers);
    const newShow = [...showResults];
    newShow[idx] = false;
    setShowResults(newShow);
    const newHints = [...hints];
    newHints[idx] = false;
    setHints(newHints);
  };

  const checkAnswer = (idx: number) => {
    const userAns = userAnswers[idx].trim().replace(',', '.');
    const correctAns = problems[idx].answer.replace(',', '.');
    const isCorrect = userAns === correctAns;
    const newShow = [...showResults];
    newShow[idx] = true;
    setShowResults(newShow);
    const newAttempts = [...totalAttempts];
    newAttempts[idx]++;
    setTotalAttempts(newAttempts);
    if (isCorrect) {
      const newCorrect = [...correctCount];
      newCorrect[idx]++;
      setCorrectCount(newCorrect);
    }
    return isCorrect;
  };

  const renderProblem = (idx: number) => {
    const p = problems[idx];
    const isCorrect = showResults[idx] ? (userAnswers[idx].trim().replace(',', '.') === p.answer.replace(',', '.')) : null;
    return (
      <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>{p.text}</div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={userAnswers[idx]}
            onChange={e => { const na = [...userAnswers]; na[idx] = e.target.value; setUserAnswers(na); }}
            onKeyDown={e => { if (e.key === 'Enter') checkAnswer(idx); }}
            style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '2px solid #e2e8f0', fontSize: '1rem', width: 180 }}
            placeholder="Nhập đáp án..."
          />
          <button onClick={() => checkAnswer(idx)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: '#2563eb', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Kiểm tra</button>
          <button onClick={() => { const h = [...hints]; h[idx] = !h[idx]; setHints(h); }} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#fef3c7', border: '1px solid #f59e0b', cursor: 'pointer', fontWeight: 500 }}>💡 Gợi ý</button>
          <button onClick={() => refreshProblem(idx)} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 500 }}>🔄</button>
        </div>
        {hints[idx] && <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fefce8', borderRadius: 8, border: '1px solid #fde047', color: '#854d0e' }}>{p.hint}</div>}
        {showResults[idx] && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: 8, background: isCorrect ? '#dcfce7' : '#fee2e2', border: `1px solid ${isCorrect ? '#22c55e' : '#ef4444'}`, fontWeight: 600 }}>
            {isCorrect ? '✅ Chính xác!' : `❌ Đáp án đúng: ${p.answer}`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ margin: '2rem 0', padding: '1.5rem', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', color: '#1e293b' }}>🧮 Số thập phân — Luyện tập tương tác</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {tabKeys.map((k, i) => (
          <button key={k} onClick={() => setActiveTab(i)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: activeTab === i ? '#2563eb' : '#f1f5f9', color: activeTab === i ? 'white' : '#64748b', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            {tabLabels[i]} {scores[i] > 0 && `(${scores[i]})`}
          </button>
        ))}
      </div>
      {renderProblem(activeTab)}
      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '1rem' }}>
        Đã đúng: {correctCount[activeTab]}/{totalAttempts[activeTab]}
      </div>
    </div>
  );
}
