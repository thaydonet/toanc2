import { useState, useCallback } from 'react';

interface Fraction {
  num: number;
  den: number;
}

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
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
};

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const simplify = (n: number, d: number): Fraction => {
  const g = gcd(n, d);
  let sn = n / g;
  let sd = d / g;
  if (sd < 0) { sn = -sn; sd = -sd; }
  return { num: sn, den: sd };
};

const fracToStr = (f: Fraction) => `\\frac{${f.num}}{${f.den}}`;

const generatePractice = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const k = randInt(2, 6);
    const n = randInt(1, 10);
    const d = randInt(2, 12);
    const expanded = simplify(n * k, d * k);
    return {
      text: `Phân số nào bằng ${fracToStr({ num: n, den: d })} ?`,
      answer: `${expanded.num}/${expanded.den}`,
      hint: `Nhân cả tử và mẫu với ${k}: \\frac{${n}×${k}}{${d}×${k}} = \\frac{${n*k}}{${d*k}} = ${fracToStr(expanded)}.`,
    };
  } else if (type === 1) {
    const n = randInt(2, 20);
    const d = randInt(2, 20);
    const g = gcd(n, d);
    return {
      text: `Rút gọn ${fracToStr({ num: n, den: d })} (tử/mẫu)`,
      answer: `${n/g}/${d/g}`,
      hint: `ƯCLN(${n}, ${d}) = ${g}. Chia cả tử và mẫu cho ${g}.`,
    };
  } else {
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    return {
      text: `Viết số nguyên ${a} dưới dạng phân số (tử/mẫu)`,
      answer: `${a}/1`,
      hint: `Mọi số nguyên n đều viết được dưới dạng \\frac{n}{1}.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(1, 8);
    const b = randInt(2, 12);
    const c = randInt(1, 8);
    const d = b;
    return {
      text: `So sánh ${fracToStr({ num: a, den: b })} và ${fracToStr({ num: c, den: d })}`,
      answer: a > c ? '>' : a < c ? '<' : '=',
      hint: `Cùng mẫu ${b}, so sánh tử: ${a} ${a > c ? '>' : a < c ? '<' : '='} ${c}.`,
    };
  } else if (type === 1) {
    const n = randInt(1, 9);
    const d = randInt(2, 10);
    return {
      text: `${fracToStr({ num: n, den: d })} là phân số: (1=dương, 2=âm, 3=tối giản)`,
      answer: '1',
      hint: `Tử ${n} > 0, mẫu ${d} > 0 nên phân số dương. ƯCLN(${n},${d}) = ${gcd(n,d)}.`,
    };
  } else {
    const n = randInt(2, 30);
    const d = randInt(2, 30);
    const g = gcd(n, d);
    return {
      text: `ƯCLN(${n}, ${d}) = ?`,
      answer: `${g}`,
      hint: `ƯCLN(${n}, ${d}) là ước chung lớn nhất của ${n} và ${d}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const a = randInt(1, 8);
    const b = randInt(2, 10);
    const k = randInt(2, 5);
    return {
      text: `Tìm x: ${fracToStr({ num: a, den: b })} = ${fracToStr({ num: a * k, den: b * k })} (x = ${k})`,
      answer: `${k}`,
      hint: `Tử ${a*k} chia cho ${a} = ${k}. Mẫu ${b*k} chia cho ${b} = ${k}.`,
    };
  } else {
    const a = randInt(1, 10);
    const b = randInt(2, 10);
    const g = gcd(a, b);
    const sa = a / g;
    const sb = b / g;
    return {
      text: `Phân số tối giản của ${fracToStr({ num: a, den: b })} là \\frac{x}{${sb}}. Tìm x`,
      answer: `${sa}`,
      hint: `ƯCLN(${a}, ${b}) = ${g}. ${a}÷${g} = ${sa}.`,
    };
  }
};

export default function PhanSoInteractive() {
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
            <button
              onClick={onCheck}
              className="px-6 py-2 text-white rounded-lg font-medium transition-colors"
              style={{ background: color }}
            >
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-6 py-2 text-white rounded-lg font-medium transition-colors"
              style={{ background: color }}
            >
              Câu tiếp →
            </button>
          )}
        </div>

        {answer.isCorrect !== null && (
          <div className={`text-center p-3 rounded-lg ${
            answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
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
    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">
        🧮 Thực hành: Phân số & Phân số bằng nhau
      </h3>

      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-600">Điểm: </span>
          <span className="font-bold text-green-600">{score}</span>
          <span className="text-gray-400">/{totalAttempts}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'practice'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          ✏️ Mở rộng & Rút gọn
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-white text-cyan-600 hover:bg-cyan-100'
          }`}
        >
          ⚡ Nhanh & Phân loại
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-teal-600 hover:bg-teal-100'
          }`}
        >
          🔍 Tìm x
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Mở rộng phân số & Rút gọn:',
        '#2563eb',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
        'ví dụ: 3/5',
      )}

      {activeTab === 'quick' && renderProblem(
        'Phân loại & So sánh:',
        '#0891b2',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
        'ví dụ: > hoặc 1',
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm x:',
        '#0d9488',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
        'số nguyên',
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-blue-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Phân số a/b: a là tử, b là mẫu (b ≠ 0)</li>
          <li>• Hai phân số bằng nhau: a×d = b×c</li>
          <li>• Tính chất: a/b = (a×k)/(b×k) = (a÷k)/(b÷k)</li>
          <li>• Phân số tối giản: ƯCLN(|tử|, |mẫu|) = 1</li>
        </ul>
      </div>
    </div>
  );
}
