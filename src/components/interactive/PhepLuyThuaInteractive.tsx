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
const pick = (arr: number[]) => arr[Math.floor(Math.random() * arr.length)];

const generatePractice = (): Problem => {
  const a = randInt(2, 9);
  const n = randInt(2, 4);
  return {
    text: `${a}^${n}`,
    answer: a ** n,
  };
};

const generateQuick = (): Problem => {
  const techniques = [
    () => {
      const a = pick([2, 3, 5]);
      const m = randInt(2, 3);
      const n = randInt(2, 3);
      return {
        text: `${a}^${m} × ${a}^${n}`,
        answer: a ** (m + n),
        hint: `${a}^${m} × ${a}^${n} = ${a}^(${m}+${n}) = ${a}^${m + n} = ${a ** (m + n)}.`,
      };
    },
    () => {
      const a = pick([2, 3, 5]);
      const n = randInt(2, 3);
      const m = randInt(n + 1, n + 2);
      return {
        text: `${a}^${m} : ${a}^${n}`,
        answer: a ** (m - n),
        hint: `${a}^${m} : ${a}^${n} = ${a}^(${m}-${n}) = ${a}^${m - n} = ${a ** (m - n)}.`,
      };
    },
    () => {
      const a = pick([2, 3]);
      const m = randInt(2, 3);
      const n = randInt(2, 3);
      return {
        text: `(${a}^${m})^${n}`,
        answer: a ** (m * n),
        hint: `(${a}^${m})^${n} = ${a}^(${m}×${n}) = ${a}^${m * n} = ${a ** (m * n)}.`,
      };
    },
    () => {
      const b = pick([2, 3, 4]);
      return {
        text: `10^${b}`,
        answer: 10 ** b,
        hint: `10^${b} là số có 1 chữ số 1 và ${b} chữ số 0: ${10 ** b}.`,
      };
    },
  ];
  return techniques[randInt(0, techniques.length - 1)]();
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = pick([2, 3, 5]);
    const e = randInt(2, 5);
    return {
      text: `${a}^x = ${a ** e}`,
      answer: e,
      hint: `${a}^x = ${a}^${e} nên x = ${e}.`,
    };
  } else if (type === 1) {
    const a = pick([2, 3, 4, 5]);
    const e = pick([2, 3]);
    return {
      text: `x^${e} = ${a ** e}`,
      answer: a,
      hint: `Vì x^${e} = ${a}^${e} và x > 0 nên x = ${a}.`,
    };
  } else {
    const a = pick([2, 3, 5]);
    const k = randInt(1, 2);
    const e = randInt(2, 4);
    return {
      text: `${a}^x × ${a}^${k} = ${a ** (e + k)}`,
      answer: e,
      hint: `${a}^x × ${a}^${k} = ${a}^{x+${k}} = ${a}^${e + k} nên x + ${k} = ${e + k} ⇒ x = ${e}.`,
    };
  }
};

export default function PhepLuyThuaInteractive() {
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
          {problem.text} = ?
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
              <p className="font-bold">✅ Chính xác! {problem.answer}</p>
            ) : (
              <p className="font-bold">❌ Đáp án đúng là: {problem.answer}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-amber-800 mb-4 text-center">
        🧮 Thực hành: Lũy thừa với số mũ tự nhiên
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
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-amber-600 hover:bg-amber-100'
          }`}
        >
          ✏️ Luyện tập
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-green-600 hover:bg-green-100'
          }`}
        >
          ⚡ Tính nhanh
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-600 hover:bg-purple-100'
          }`}
        >
          🔍 Tìm x
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Tính giá trị của lũy thừa:',
        '#d97706',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Áp dụng tính chất của lũy thừa:',
        '#16a34a',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm số chưa biết (x là số mũ hoặc cơ số):',
        '#7c3aed',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-amber-800 font-medium mb-2">💡 Ghi nhớ:</p>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• aⁿ = a × a × ... × a (n thừa số); a¹ = a; a⁰ = 1</li>
          <li>• Nhân: aᵐ × aⁿ = aᵐ⁺ⁿ ; Chia: aᵐ : aⁿ = aᵐ⁻ⁿ</li>
          <li>• Lũy thừa của lũy thừa: (aᵐ)ⁿ = aᵐˣⁿ ; 10ⁿ có n chữ số 0</li>
        </ul>
      </div>
    </div>
  );
}
