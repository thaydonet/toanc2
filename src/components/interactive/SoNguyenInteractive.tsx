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
    const n = randInt(-20, 20);
    let ans: number;
    if (n > 0) ans = 1;
    else if (n < 0) ans = 2;
    else ans = 3;
    return {
      text: `Số ${n} là: (1=Số nguyên dương, 2=Số nguyên âm, 3=Số 0)`,
      answer: ans,
      hint: `${n} ${n < 0 ? 'nhỏ hơn 0 nên là số nguyên âm' : n > 0 ? 'lớn hơn 0 nên là số nguyên dương' : 'bằng 0'}.`,
    };
  } else if (type === 1) {
    const a = randInt(-20, 20);
    const b = randInt(-20, 20);
    return {
      text: `Trên trục số, so sánh ${a} và ${b}: (1=${a} lớn hơn, 2=${a} nhỏ hơn)`,
      answer: a > b ? 1 : 2,
      hint: `Số nào nằm bên phải trên trục số thì lớn hơn: ${a > b ? `${a} > ${b}` : `${a} < ${b}`}.`,
    };
  } else {
    const n = randInt(-30, 30);
    return {
      text: `Số đối của ${n} là:`,
      answer: -n,
      hint: `Hai số đối nhau có tổng bằng 0, nên số đối của ${n} là -(${n}) = ${-n}.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const n = randInt(-50, 50);
    return {
      text: `Giá trị tuyệt đối của ${n} là?`,
      answer: Math.abs(n),
      hint: `|${n}| là khoảng cách từ ${n} đến 0, luôn không âm: = ${Math.abs(n)}.`,
    };
  } else if (type === 1) {
    const n = randInt(-50, 50);
    return {
      text: `Số đối của ${n} là?`,
      answer: -n,
      hint: `Số đối của a là -a. Vậy số đối của ${n} là ${-n}.`,
    };
  } else {
    const n = pick([-12, -9, -6, -3, 0, 3, 5, 8, 10, 15]);
    let ans: number;
    if (n > 0) ans = 1;
    else if (n < 0) ans = 2;
    else ans = 3;
    return {
      text: `Phân loại ${n}: (1=Dương, 2=Âm, 3=Số 0)`,
      answer: ans,
      hint: `${n} ${n < 0 ? 'nhỏ hơn 0 nên là số âm' : n > 0 ? 'lớn hơn 0 nên là số dương' : 'bằng 0'}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const target = randInt(-10, 10);
  return {
    text: `Tìm số nguyên liền sau số ${target} trên trục số:`,
    answer: target + 1,
    hint: `Trên trục số, số liền sau ${target} là ${target} + 1 = ${target + 1}.`,
  };
};

export default function SoNguyenInteractive() {
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
    <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">
        🧮 Thực hành: Tập hợp số nguyên
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
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-600 hover:bg-purple-100'
          }`}
        >
          ✏️ Nhận biết & So sánh
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-fuchsia-600 text-white shadow-md'
              : 'bg-white text-fuchsia-600 hover:bg-fuchsia-100'
          }`}
        >
          ⚡ Số đối & GTTĐ
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-indigo-600 hover:bg-indigo-100'
          }`}
        >
          🔍 Trên trục số
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Nhận biết loại số và so sánh:',
        '#7c3aed',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Tính nhanh số đối và giá trị tuyệt đối:',
        '#c026d3',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Xác định số nguyên trên trục số:',
        '#4f46e5',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-purple-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Số nguyên: ..., -3, -2, -1, 0, 1, 2, 3, ... (ký hiệu ℤ)</li>
          <li>• Số đối của a là -a: luôn có a + (-a) = 0</li>
          <li>• Giá trị tuyệt đối |a| ≥ 0 là khoảng cách từ a đến 0</li>
          <li>• So sánh: dương &gt; 0 &gt; âm; số âm càng xa 0 càng nhỏ</li>
        </ul>
      </div>
    </div>
  );
}