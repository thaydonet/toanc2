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

const fracToStr = (n: number, d: number) => `\\frac{${n}}{${d}}`;

const generatePractice = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(1, 8);
    const b = randInt(1, 8);
    const d = randInt(2, 12);
    return {
      text: `So sánh ${fracToStr(a, d)} và ${fracToStr(b, d)}`,
      answer: a > b ? '>' : a < b ? '<' : '=',
      hint: `Cùng mẫu ${d}, so sánh tử: ${a} ${a > b ? '>' : a < b ? '<' : '='} ${b}.`,
    };
  } else if (type === 1) {
    const a = randInt(1, 5);
    const b = randInt(1, 5);
    const m = randInt(2, 8);
    const n = randInt(2, 8);
    return {
      text: `So sánh ${fracToStr(a, m)} và ${fracToStr(b, n)}`,
      answer: a * n > b * m ? '>' : a * n < b * m ? '<' : '=',
      hint: `Quy đồng: ${a}×${n}=${a*n} và ${b}×${m}=${b*m}.`,
    };
  } else {
    const mixed = randInt(1, 4);
    const num = randInt(1, 5);
    const den = randInt(2, 8);
    const improper = mixed * den + num;
    return {
      text: `Đổi ${mixed}\\frac{${num}}{${den}} thành phân số (tử/mẫu)`,
      answer: `${improper}/${den}`,
      hint: `${mixed}\\frac{${num}}{${den}} = \\frac{${mixed}×${den}+${num}}{${den}} = \\frac{${improper}}{${den}}.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const n = randInt(5, 20);
    const d = randInt(2, 8);
    const q = Math.floor(n / d);
    const r = n % d;
    return {
      text: `Đổi ${fracToStr(n, d)} thành hỗn số (phần nguyên)`,
      answer: `${q}`,
      hint: `${n} : ${d} = ${q} dư ${r}.`,
    };
  } else if (type === 1) {
    const a = randInt(1, 7);
    const b = randInt(2, 10);
    const c = randInt(1, 7);
    const d = b;
    return {
      text: `${fracToStr(a, d)} và ${fracToStr(c, d)}: lớn hơn là?`,
      answer: `${Math.max(a, c)}/${d}`,
      hint: `Cùng mẫu, phân số có tử lớn hơn thì lớn hơn.`,
    };
  } else {
    const pairs: [string, string][] = [
      ['3/8', '1/2'], ['2/5', '3/7'], ['5/6', '7/9'], ['1/3', '2/5'],
    ];
    const [f1, f2] = pick(pairs);
    const [a, b] = f1.split('/').map(Number);
    const [c, d] = f2.split('/').map(Number);
    const result = a * d > b * c ? f1 : f2;
    return {
      text: `Phân số lớn hơn: ${f1} hay ${f2}?`,
      answer: result,
      hint: `${a}×${d}=${a*d} và ${c}×${b}=${c*b}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const a = randInt(1, 6);
    const b = randInt(2, 8);
    const k = randInt(2, 4);
    return {
      text: `Tìm x: \\frac{${a}}{${b}} = \\frac{${a*k}}{x}`,
      answer: `${b*k}`,
      hint: `Tử nhân ${k}, mẫu cũng nhân ${k}: ${b}×${k} = ${b*k}.`,
    };
  } else {
    const a = randInt(2, 8);
    const d = randInt(2, 8);
    const b = randInt(1, a - 1);
    const c = Math.round(b * d / a);
    return {
      text: `Tìm x: \\frac{${a}}{${d}} = \\frac{${b}}{x}`,
      answer: `${c}`,
      hint: `a×d = b×x → ${a}×${d} = ${b}×x → x = ${a*d}/${b} = ${c}.`,
    };
  }
};

export default function SoSanhPhanSoInteractive() {
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
        <div className="text-2xl font-mono font-bold" style={{ color }}>
          {problem.text}
        </div>
        {problem.hint && (
          <p className="text-sm text-gray-400 mt-2">💡 {problem.hint}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={answer.value}
          onChange={(e) => setAnswer({ ...answer, value: e.target.value, isCorrect: null })}
          onKeyDown={(e) => handleKeyPress(e, onCheck)}
          className="w-48 text-center text-xl font-mono border-2 rounded-lg p-3 focus:outline-none"
          style={{ borderColor: color + '88' }}
          placeholder={placeholder || '?'}
          disabled={answer.isCorrect !== null}
        />

        <div className="flex gap-3">
          {answer.isCorrect === null ? (
            <button onClick={onCheck} className="px-6 py-2 text-white rounded-lg font-medium" style={{ background: color }}>
              Kiểm tra
            </button>
          ) : (
            <button onClick={onNext} className="px-6 py-2 text-white rounded-lg font-medium" style={{ background: color }}>
              Câu tiếp →
            </button>
          )}
        </div>

        {answer.isCorrect !== null && (
          <div className={`text-center p-3 rounded-lg ${answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {answer.isCorrect ? (
              <p className="font-bold">✅ Chính xác! Đáp án: {problem.answer}</p>
            ) : (
              <p className="font-bold">❌ Đáp án đúng: {problem.answer}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-emerald-900 mb-4 text-center">
        🧮 Thực hành: So sánh phân số & Hỗn số
      </h3>

      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-600">Điểm: </span>
          <span className="font-bold text-green-600">{score}</span>
          <span className="text-gray-400">/{totalAttempts}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'practice' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-emerald-600 hover:bg-emerald-100'}`}>
          ✏️ So sánh
        </button>
        <button onClick={() => setActiveTab('quick')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'quick' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-green-600 hover:bg-green-100'}`}>
          ⚡ Hỗn số
        </button>
        <button onClick={() => setActiveTab('findX')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'findX' ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-teal-600 hover:bg-teal-100'}`}>
          🔍 Tìm mẫu số
        </button>
      </div>

      {activeTab === 'practice' && renderProblem('So sánh phân số:', '#059669', practice, practiceAns, setPracticeAns, () => checkAnswer(practice, practiceAns, setPracticeAns), nextPractice, '> hoặc < hoặc =')}
      {activeTab === 'quick' && renderProblem('Chuyển đổi & So sánh:', '#16a34a', quick, quickAns, setQuickAns, () => checkAnswer(quick, quickAns, setQuickAns), nextQuick)}
      {activeTab === 'findX' && renderProblem('Tìm mẫu số x:', '#0d9488', findX, findXAns, setFindXAns, () => checkAnswer(findX, findXAns, setFindXAns), nextFindX, 'số nguyên')}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-emerald-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-emerald-800 space-y-1">
          <li>• Cùng mẫu: phân số nào tử lớn hơn thì lớn hơn</li>
          <li>• Khác mẫu: quy đồng rồi so sánh tử</li>
          <li>• a/b = (a×c)/(b×c) — quy tắc cơ bản</li>
          <li>• Hỗn số: a(b/c) = (a×c+b)/c</li>
        </ul>
      </div>
    </div>
  );
}
