import { useState, useCallback } from 'react';

interface Problem {
  text: string;
  answer: number;
  hint?: string;
}

interface UserAnswer {
  value: string;
  isCorrect: boolean | null;
}

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generatePractice = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const b = pick([2, 3, 4, 5, 6, 10]);
    const q = randInt(-10, 10);
    if (q === 0) return generatePractice();
    const a = q * b;
    return {
      text: `${a} : ${b} = ?`,
      answer: q,
      hint: `${a} : ${b} = ${q}. Phép chia số nguyên: chia hết thì thương là số nguyên.`,
    };
  } else if (type === 1) {
    const b = pick([-2, -3, -4, -5, -6]);
    const q = randInt(1, 10);
    const a = q * b;
    return {
      text: `${a} : (${b}) = ?`,
      answer: q,
      hint: `${a} : (${b}) = ${q}. Hai số âm chia cho nhau cho thương dương.`,
    };
  } else {
    const n = pick([-12, -18, -24, 20, 30, 36]);
    const candidates = [1, 2, 3, 4, 5, 6, 8, 10, 12];
    const x = pick(candidates);
    const isFactor = Math.abs(n) % x === 0;
    return {
      text: `Số ${x} có phải là ước của ${n} không? (1=Có, 0=Không)`,
      answer: isFactor ? 1 : 0,
      hint: `${x} là ước của ${n} nếu ${n} : ${x} là số nguyên. ${n} : ${x} = ${n / x}.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const b = pick([-5, -3, -2, -4]);
    return {
      text: `0 : (${b}) = ?`,
      answer: 0,
      hint: `0 chia cho bất kỳ số khác 0 đều bằng 0.`,
    };
  } else if (type === 1) {
    const a = randInt(-15, 15);
    return {
      text: `${a} : 1 = ?`,
      answer: a,
      hint: `Bất kỳ số nào chia cho 1 đều bằng chính nó.`,
    };
  } else {
    const n = pick([-3, -4, -5, -6, -7, -8]);
    const ans = Math.abs(n);
    return {
      text: `Bội dương nhỏ nhất của ${n} là?`,
      answer: ans,
      hint: `Bội của ${n}: ${n}, ${2 * n}, ${3 * n}, ... Bội dương nhỏ nhất là ${ans}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const x = pick([2, 3, 4, 5, 6, 8]);
    const q = randInt(-8, 8);
    if (q === 0) return generateFindX();
    const a = q * x;
    return {
      text: `${a} : x = ${q} → x = ?`,
      answer: x,
      hint: `x = ${a} : ${q} = ${x}.`,
    };
  } else if (type === 1) {
    const a = pick([-3, -4, -5, -6]);
    const b = randInt(1, 8);
    const x = a * b;
    return {
      text: `x : (${a}) = ${b} → x = ?`,
      answer: x,
      hint: `x = ${b} × (${a}) = ${x}.`,
    };
  } else {
    const n = pick([12, 16, 18, 20, 24, 30, 36]);
    const factors = [];
    for (let i = 1; i <= Math.abs(n); i++) {
      if (Math.abs(n) % i === 0) factors.push(i);
    }
    return {
      text: `Có bao nhiêu ước dương của ${Math.abs(n)}?`,
      answer: factors.length,
      hint: `Các ước dương của ${Math.abs(n)}: ${factors.join(', ')}. Tổng cộng ${factors.length} ước.`,
    };
  }
};

export default function UocBoiSoNguyenInteractive() {
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
    const parsed = parseFloat(answer.value);
    const isCorrect = !isNaN(parsed) && parsed === problem.answer;
    setAnswer({ ...answer, isCorrect });
    if (isCorrect) setScore(s => s + 1);
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
  ) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="text-center mb-4">
        <p className="text-gray-600 mb-2">{title}</p>
        <div className="text-3xl font-mono font-bold" style={{ color }}>
          {problem.text}
        </div>
        {problem.hint && (
          <p className="text-sm text-gray-400 mt-2">💡 {problem.hint}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <input
          type="number"
          value={answer.value}
          onChange={(e) => setAnswer({ ...answer, value: e.target.value, isCorrect: null })}
          onKeyDown={(e) => handleKeyPress(e, onCheck)}
          className="w-40 text-center text-2xl font-mono border-2 rounded-lg p-3 focus:outline-none"
          style={{ borderColor: color + '88' }}
          placeholder="?"
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
              <p className="font-bold">✅ Chính xác! Đáp án là {problem.answer}</p>
            ) : (
              <p className="font-bold">❌ Đáp án đúng là: {problem.answer}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-sky-900 mb-4 text-center">
        🧮 Thực hành: Phép chia, ước và bội số nguyên
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
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white text-sky-600 hover:bg-sky-100'
          }`}
        >
          ➗ Phép chia & ước
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          ⚡ Tính nhanh
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-indigo-600 hover:bg-indigo-100'
          }`}
        >
          🔍 Tìm x
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Phép chia và nhận biết ước:',
        '#0284c7',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Tính nhanh và nhận biết bội:',
        '#2563eb',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm x và đếm ước:',
        '#4f46e5',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-sky-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-sky-800 space-y-1">
          <li>• a : b = c khi a = b × c (chia hết)</li>
          <li>• Ước của a: số chia hết cho a (a : b là số nguyên)</li>
          <li>• Bội của a: số chia hết cho a (b = a × k)</li>
          <li>• a : 1 = a; 0 : a = 0 (a ≠ 0)</li>
          <li>• Cùng dấu → dương; khác dấu → âm</li>
        </ul>
      </div>
    </div>
  );
}
