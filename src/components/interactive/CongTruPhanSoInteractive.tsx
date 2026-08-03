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

const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

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
    const d = randInt(3, 10);
    const a = randInt(1, d - 1);
    const b = randInt(1, d - a);
    const [rn, rd] = simplify(a + b, d);
    return {
      text: `Tính: ${fracToStr(a, d)} + ${fracToStr(b, d)}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `Cùng mẫu: cộng tử ${a}+${b}=${a+b}, giữ mẫu ${d}.`,
    };
  } else if (type === 1) {
    const a = randInt(1, 5);
    const b = randInt(1, 5);
    const d1 = randInt(2, 6);
    const d2 = randInt(2, 6);
    const l = lcm(d1, d2);
    const na = a * (l / d1);
    const nb = b * (l / d2);
    const [rn, rd] = simplify(na + nb, l);
    return {
      text: `Tính: ${fracToStr(a, d1)} + ${fracToStr(b, d2)}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `BCNN(${d1},${d2})=${l}. Quy đồng: ${na}/${l} + ${nb}/${l} = ${na+nb}/${l}.`,
    };
  } else {
    const d = randInt(3, 10);
    const a = randInt(3, d);
    const b = randInt(1, a);
    const [rn, rd] = simplify(a - b, d);
    return {
      text: `Tính: ${fracToStr(a, d)} - ${fracToStr(b, d)}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `Cùng mẫu: trừ tử ${a}-${b}=${a-b}, giữ mẫu ${d}.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const d = randInt(3, 10);
    const a = randInt(1, d - 2);
    const b = randInt(1, d - a - 1);
    const c = randInt(1, d - a - b);
    const [rn, rd] = simplify(a + b + c, d);
    return {
      text: `Tính: ${fracToStr(a, d)} + ${fracToStr(b, d)} + ${fracToStr(c, d)}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `Cộng hết tử: ${a}+${b}+${c}=${a+b+c}, mẫu vẫn là ${d}.`,
    };
  } else if (type === 1) {
    const d = randInt(3, 8);
    const a = randInt(2, d);
    return {
      text: `Tính: ${fracToStr(a, d)} + ${fracToStr(-a, d)}`,
      answer: '0',
      hint: `Phân số đối nhau: a/b + (-a/b) = 0.`,
    };
  } else {
    const a = randInt(1, 5);
    const b = randInt(1, 5);
    const d1 = randInt(2, 6);
    const d2 = randInt(2, 6);
    const l = lcm(d1, d2);
    const na = a * (l / d1);
    const nb = b * (l / d2);
    const [rn, rd] = simplify(na - nb, l);
    return {
      text: `Tính: ${fracToStr(a, d1)} - ${fracToStr(b, d2)}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `BCNN(${d1},${d2})=${l}. ${na}/${l} - ${nb}/${l} = ${na-nb}/${l}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const d = randInt(3, 10);
    const a = randInt(1, d - 2);
    const b = randInt(1, d - a);
    const sum = a + b;
    return {
      text: `Tìm x: ${fracToStr(a, d)} + x = ${fracToStr(sum, d)}`,
      answer: `${b}/${d}`,
      hint: `x = ${fracToStr(sum, d)} - ${fracToStr(a, d)} = ${fracToStr(b, d)}.`,
    };
  } else {
    const d = randInt(3, 10);
    const a = randInt(2, d);
    const b = randInt(1, a);
    const [rn, rd] = simplify(a - b, d);
    return {
      text: `Tìm x: ${fracToStr(a, d)} - x = ${fracToStr(b, d)}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `x = ${fracToStr(a, d)} - ${fracToStr(b, d)} = ${fracToStr(a-b, d)}.`,
    };
  }
};

export default function CongTruPhanSoInteractive() {
  const [activeTab, setActiveTab] = useState<'practice' | 'quick' | 'findX'>('practice');
  const [practice, setPractice] = useState<Problem>(() => generatePractice());
  const [practiceAns, setPracticeAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [quick, setQuick] = useState<Problem>(() => generateQuick());
  const [quickAns, setQuickAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [findX, setFindX] = useState<Problem>(() => generateFindX());
  const [findXAns, setFindXAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const checkAnswer = useCallback((
    problem: Problem,
    answer: UserAnswer,
    setAnswer: (a: UserAnswer) => void,
  ) => {
    const userVal = answer.value.trim();
    const correct = userVal === problem.answer;
    setAnswer({ ...answer, isCorrect: correct });
    if (correct) setScore(s => s + 1);
    setTotalAttempts(t => t + 1);
  }, []);

  const nextPractice = () => { setPractice(generatePractice()); setPracticeAns({ value: '', isCorrect: null }); };
  const nextQuick = () => { setQuick(generateQuick()); setQuickAns({ value: '', isCorrect: null }); };
  const nextFindX = () => { setFindX(generateFindX()); setFindXAns({ value: '', isCorrect: null }); };

  const handleKeyPress = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter') fn();
  };

  const renderProblem = (
    title: string,
    color: string,
    problem: Problem,
    answer: UserAnswer,
    setAnswer: (a: UserAnswer) => void,
    onCheck: () => void,
    onNext: () => void,
    placeholder?: string,
  ) => (
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
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">
        🧮 Thực hành: Cộng và trừ phân số
      </h3>
      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-600">Điểm: </span>
          <span className="font-bold text-green-600">{score}</span>
          <span className="text-gray-400">/{totalAttempts}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'practice' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-amber-600 hover:bg-amber-100'}`}>✏️ Cộng/Trừ cùng mẫu</button>
        <button onClick={() => setActiveTab('quick')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'quick' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-orange-600 hover:bg-orange-100'}`}>⚡ Khác mẫu & Liên tiếp</button>
        <button onClick={() => setActiveTab('findX')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'findX' ? 'bg-red-600 text-white shadow-md' : 'bg-white text-red-600 hover:bg-red-100'}`}>🔍 Tìm x</button>
      </div>
      {activeTab === 'practice' && renderProblem('Cộng/Trừ cùng mẫu:', '#d97706', practice, practiceAns, setPracticeAns, () => checkAnswer(practice, practiceAns, setPracticeAns), nextPractice, 'ví dụ: 3/5')}
      {activeTab === 'quick' && renderProblem('Khác mẫu & Dãy phép tính:', '#ea580c', quick, quickAns, setQuickAns, () => checkAnswer(quick, quickAns, setQuickAns), nextQuick)}
      {activeTab === 'findX' && renderProblem('Tìm x:', '#dc2626', findX, findXAns, setFindXAns, () => checkAnswer(findX, findXAns, setFindXAns), nextFindX)}
      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-amber-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Cùng mẫu: a/m ± b/m = (a±b)/m</li>
          <li>• Khác mẫu: Quy đồng rồi cộng/trừ tử</li>
          <li>• Phân số âm: cộng GTTĐ, giữ/chuyển dấu</li>
          <li>• Tính chất: giao hoán, kết hợp</li>
        </ul>
      </div>
    </div>
  );
}
