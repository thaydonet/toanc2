import { useState, useCallback } from 'react';

interface Problem {
  text: string;
  answer: string;
  hint?: string;
}

interface UserAnswer {
  value: string;
  isCorrect: boolean | null;
}

const gcd = (a: number, b: number): number => {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
};

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const simplify = (n: number, d: number): [number, number] => {
  if (d === 0) return [n, d];
  const g = gcd(n, d);
  let sn = n / g, sd = d / g;
  if (sd < 0) { sn = -sn; sd = -sd; }
  return [sn, sd];
};

const fracToStr = (n: number, d: number) => {
  const [sn, sd] = simplify(n, d);
  if (sd === 1) return `${sn}`;
  return `\\frac{${sn}}{${sd}}`;
};

const generatePractice = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(1, 7); const b = randInt(2, 10);
    const n = randInt(5, 20) * b;
    const [rn, rd] = simplify(a * n, b);
    return {
      text: `Tìm ${fracToStr(a, b)} của ${n}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `${fracToStr(a,b)} × ${n} = ${fracToStr(a*n, b)}.`,
    };
  } else if (type === 1) {
    const a = randInt(1, 5); const b = randInt(2, 8);
    const result = randInt(2, 10) * a;
    const whole = result * b / a;
    return {
      text: `${fracToStr(a, b)} của một số là ${result}. Số đó là?`,
      answer: `${whole}`,
      hint: `Số = ${result} ÷ ${fracToStr(a,b)} = ${result} × ${fracToStr(b,a)} = ${whole}.`,
    };
  } else {
    const total = randInt(20, 60);
    const a = randInt(1, 4); const b = randInt(2, 6);
    const part = Math.round(total * a / b);
    return {
      text: `Lớp có ${total} HS, ${fracToStr(a, b)} là nữ. Số nữ là?`,
      answer: `${part}`,
      hint: `${fracToStr(a,b)} × ${total} = ${fracToStr(a*total, b)} = ${part}.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(1, 5); const b = randInt(2, 8);
    const whole = randInt(2, 10) * b;
    const result = a * whole / b;
    return {
      text: `${fracToStr(a, b)} của ${whole} là?`,
      answer: `${result}`,
      hint: `${a} × ${whole} ÷ ${b} = ${result}.`,
    };
  } else if (type === 1) {
    const a = randInt(1, 4); const b = randInt(2, 6);
    const result = randInt(3, 12) * a;
    const whole = result * b / a;
    return {
      text: `${fracToStr(a, b)} của x = ${result}. x = ?`,
      answer: `${whole}`,
      hint: `x = ${result} × ${fracToStr(b,a)} = ${whole}.`,
    };
  } else {
    const total = randInt(30, 100);
    const a = randInt(1, 3); const b = randInt(3, 6);
    const rest = total - Math.round(total * a / b);
    return {
      text: `${total} kẹo, lấy ${fracToStr(a,b)}. Còn lại?`,
      answer: `${rest}`,
      hint: `Lấy: ${fracToStr(a,b)}×${total}=${Math.round(total*a/b)}. Còn: ${total}-${Math.round(total*a/b)}=${rest}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const a = randInt(1, 5); const b = randInt(2, 8);
    const result = randInt(2, 10) * a;
    return {
      text: `${fracToStr(a, b)} × x = ${result}. x = ?`,
      answer: `${result * b / a}`,
      hint: `x = ${result} ÷ ${fracToStr(a,b)} = ${result} × ${fracToStr(b,a)}.`,
    };
  } else {
    const a = randInt(1, 4); const b = randInt(2, 6);
    const whole = randInt(3, 10) * b;
    const result = a * whole / b;
    return {
      text: `x × ${fracToStr(a, b)} = ${result}. x = ?`,
      answer: `${whole}`,
      hint: `x = ${result} ÷ ${fracToStr(a,b)} = ${whole}.`,
    };
  }
};

export default function HaiBaiToanPhanSoInteractive() {
  const [activeTab, setActiveTab] = useState<'practice' | 'quick' | 'findX'>('practice');
  const [practice, setPractice] = useState<Problem>(() => generatePractice());
  const [practiceAns, setPracticeAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [quick, setQuick] = useState<Problem>(() => generateQuick());
  const [quickAns, setQuickAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [findX, setFindX] = useState<Problem>(() => generateFindX());
  const [findXAns, setFindXAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const checkAnswer = useCallback((problem: Problem, answer: UserAnswer, setAnswer: (a: UserAnswer) => void) => {
    const userVal = answer.value.trim();
    const correct = userVal === problem.answer;
    setAnswer({ ...answer, isCorrect: correct });
    if (correct) setScore(s => s + 1);
    setTotalAttempts(t => t + 1);
  }, []);

  const nextPractice = () => { setPractice(generatePractice()); setPracticeAns({ value: '', isCorrect: null }); };
  const nextQuick = () => { setQuick(generateQuick()); setQuickAns({ value: '', isCorrect: null }); };
  const nextFindX = () => { setFindX(generateFindX()); setFindXAns({ value: '', isCorrect: null }); };

  const handleKeyPress = (e: React.KeyboardEvent, fn: () => void) => { if (e.key === 'Enter') fn(); };

  const renderProblem = (title: string, color: string, problem: Problem, answer: UserAnswer, setAnswer: (a: UserAnswer) => void, onCheck: () => void, onNext: () => void, placeholder?: string) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="text-center mb-4">
        <p className="text-gray-600 mb-2">{title}</p>
        <div className="text-2xl font-mono font-bold" style={{ color }}>{problem.text}</div>
        {problem.hint && <p className="text-sm text-gray-400 mt-2">💡 {problem.hint}</p>}
      </div>
      <div className="flex flex-col items-center gap-4">
        <input type="text" value={answer.value} onChange={(e) => setAnswer({ ...answer, value: e.target.value, isCorrect: null })}
          onKeyDown={(e) => handleKeyPress(e, onCheck)} className="w-48 text-center text-xl font-mono border-2 rounded-lg p-3 focus:outline-none"
          style={{ borderColor: color + '88' }} placeholder={placeholder || '?'} disabled={answer.isCorrect !== null} />
        <div className="flex gap-3">
          {answer.isCorrect === null ? (
            <button onClick={onCheck} className="px-6 py-2 text-white rounded-lg font-medium" style={{ background: color }}>Kiểm tra</button>
          ) : (
            <button onClick={onNext} className="px-6 py-2 text-white rounded-lg font-medium" style={{ background: color }}>Câu tiếp →</button>
          )}
        </div>
        {answer.isCorrect !== null && (
          <div className={`text-center p-3 rounded-lg ${answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {answer.isCorrect ? <p className="font-bold">✅ Chính xác! Đáp án: {problem.answer}</p> : <p className="font-bold">❌ Đáp án đúng: {problem.answer}</p>}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-sky-900 mb-4 text-center">
        🧮 Thực hành: Hai bài toán về phân số
      </h3>
      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-600">Điểm: </span>
          <span className="font-bold text-green-600">{score}</span>
          <span className="text-gray-400">/{totalAttempts}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'practice' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-sky-600 hover:bg-sky-100'}`}>✏️ Tìm phân số</button>
        <button onClick={() => setActiveTab('quick')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'quick' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-blue-600 hover:bg-blue-100'}`}>⚡ Tìm số</button>
        <button onClick={() => setActiveTab('findX')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'findX' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-600 hover:bg-indigo-100'}`}>🔍 Tìm x</button>
      </div>
      {activeTab === 'practice' && renderProblem('Tìm phân số của một số:', '#0284c7', practice, practiceAns, setPracticeAns, () => checkAnswer(practice, practiceAns, setPracticeAns), nextPractice)}
      {activeTab === 'quick' && renderProblem('Tìm số khi biết phân số:', '#2563eb', quick, quickAns, setQuickAns, () => checkAnswer(quick, quickAns, setQuickAns), nextQuick)}
      {activeTab === 'findX' && renderProblem('Tìm x:', '#4f46e5', findX, findXAns, setFindXAns, () => checkAnswer(findX, findXAns, setFindXAns), nextFindX)}
      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-sky-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-sky-800 space-y-1">
          <li>• Tìm phân số của số: (m/n) × a</li>
          <li>• Tìm số khi biết phân số: b ÷ (m/n) = b × (n/m)</li>
          <li>• Đọc kĩ đề bài, xác định dạng toán</li>
          <li>• Kiểm tra đáp số bằng cách thế ngược</li>
        </ul>
      </div>
    </div>
  );
}
