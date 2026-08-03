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
    const a = randInt(1, 6); const b = randInt(2, 9);
    const c = randInt(1, 6); const d = randInt(2, 9);
    const [rn, rd] = simplify(a * c, b * d);
    return {
      text: `Tính: ${fracToStr(a, b)} × ${fracToStr(c, d)}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `Nhân tử với tử: ${a}×${c}=${a*c}. Nhân mẫu với mẫu: ${b}×${d}=${b*d}.`,
    };
  } else if (type === 1) {
    const a = randInt(1, 6); const b = randInt(2, 9);
    const c = randInt(1, 6); const d = randInt(2, 9);
    const [rn, rd] = simplify(a * d, b * c);
    return {
      text: `Tính: ${fracToStr(a, b)} ÷ ${fracToStr(c, d)}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `Chia = nhân nghịch đảo: ${fracToStr(a,b)} × ${fracToStr(d,c)}.`,
    };
  } else {
    const a = randInt(1, 7); const b = randInt(2, 9);
    const n = randInt(2, 6);
    const [rn, rd] = simplify(a * n, b);
    return {
      text: `Tính: ${fracToStr(a, b)} × ${n}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `Nhân tử: ${a}×${n}=${a*n}, mẫu giữ nguyên ${b}.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(1, 8); const b = randInt(2, 9);
    return {
      text: `Phân số nghịch đảo của ${fracToStr(a, b)} là?`,
      answer: b === 1 ? `${a}` : `${b}/${a}`,
      hint: `Nghịch đảo: đảo tử và mẫu.`,
    };
  } else if (type === 1) {
    const a = randInt(1, 6); const b = randInt(2, 8);
    const c = a; const d = randInt(2, 8);
    return {
      text: `${fracToStr(a, b)} × ${fracToStr(b, a)} = ?`,
      answer: '1',
      hint: `Phân số nhân nghịch đảo luôn bằng 1.`,
    };
  } else {
    const a = randInt(1, 5); const b = randInt(2, 7);
    const c = randInt(1, 5); const d = randInt(2, 7);
    const n1 = a * c; const d1 = b * d;
    const n2 = a * d; const d2 = b * c;
    return {
      text: `${fracToStr(a,b)} × ${fracToStr(c,d)} = ?`,
      answer: fracToStr(n1, d1).replace(/\\frac\{(\d+)\}\{(\d+)\}/, '$1/$2'),
      hint: `Nhân tử×tử=${n1}, mẫu×mẫu=${d1}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const a = randInt(1, 6); const b = randInt(2, 8);
    const c = randInt(1, 5); const d = randInt(2, 8);
    const [rn, rd] = simplify(a * d, b * c);
    return {
      text: `Tìm x: ${fracToStr(a,b)} × x = ${fracToStr(c,d)}`,
      answer: rd === 1 ? `${rn}` : `${rn}/${rd}`,
      hint: `x = ${fracToStr(c,d)} ÷ ${fracToStr(a,b)} = ${fracToStr(c,d)} × ${fracToStr(b,a)}.`,
    };
  } else {
    const a = randInt(1, 6); const b = randInt(2, 8);
    const n = randInt(2, 6);
    return {
      text: `Tìm x: ${fracToStr(a,b)} × x = ${n}`,
      answer: `${n*b}/${a}`,
      hint: `x = ${n} ÷ ${fracToStr(a,b)} = ${n} × ${fracToStr(b,a)} = ${fracToStr(n*b, a)}.`,
    };
  }
};

export default function NhanChiaPhanSoInteractive() {
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
    <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-rose-900 mb-4 text-center">
        🧮 Thực hành: Nhân và chia phân số
      </h3>
      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-600">Điểm: </span>
          <span className="font-bold text-green-600">{score}</span>
          <span className="text-gray-400">/{totalAttempts}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'practice' ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-rose-600 hover:bg-rose-100'}`}>✏️ Nhân & Chia</button>
        <button onClick={() => setActiveTab('quick')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'quick' ? 'bg-pink-600 text-white shadow-md' : 'bg-white text-pink-600 hover:bg-pink-100'}`}>⚡ Nghịch đảo</button>
        <button onClick={() => setActiveTab('findX')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'findX' ? 'bg-fuchsia-600 text-white shadow-md' : 'bg-white text-fuchsia-600 hover:bg-fuchsia-100'}`}>🔍 Tìm x</button>
      </div>
      {activeTab === 'practice' && renderProblem('Nhân & Chia phân số:', '#e11d48', practice, practiceAns, setPracticeAns, () => checkAnswer(practice, practiceAns, setPracticeAns), nextPractice)}
      {activeTab === 'quick' && renderProblem('Nghịch đảo & Tính nhanh:', '#db2777', quick, quickAns, setQuickAns, () => checkAnswer(quick, quickAns, setQuickAns), nextQuick)}
      {activeTab === 'findX' && renderProblem('Tìm x:', '#9333ea', findX, findXAns, setFindXAns, () => checkAnswer(findX, findXAns, setFindXAns), nextFindX)}
      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-rose-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-rose-800 space-y-1">
          <li>• Nhân: (a/b)×(c/d) = (a×c)/(b×d)</li>
          <li>• Chia: (a/b)÷(c/d) = (a/b)×(d/c)</li>
          <li>• Nghịch đảo: a/b và b/a, tích = 1</li>
          <li>• Rút gọn chéo trước khi nhân</li>
        </ul>
      </div>
    </div>
  );
}
