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
    const a = randInt(1, 15);
    const b = randInt(1, 15);
    const ans = -(a * b);
    return {
      text: `(-${a}) × ${b} = ?`,
      answer: ans,
      hint: `(-${a}) × ${b} = -(${a} × ${b}) = ${ans}. Khác dấu → âm.`,
    };
  } else if (type === 1) {
    const a = randInt(1, 15);
    const b = randInt(1, 15);
    const ans = a * b;
    return {
      text: `(-${a}) × (-${b}) = ?`,
      answer: ans,
      hint: `(-${a}) × (-${b}) = ${a} × ${b} = ${ans}. Cùng dấu → dương.`,
    };
  } else {
    const a = randInt(1, 15);
    const b = randInt(1, 15);
    const ans = -(a * b);
    return {
      text: `${a} × (-${b}) = ?`,
      answer: ans,
      hint: `${a} × (-${b}) = -(${a} × ${b}) = ${ans}. Khác dấu → âm.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    const c = randInt(1, 10);
    const ans = a * b * c;
    return {
      text: `(-${a}) × ${b} × (-${c}) = ?`,
      answer: ans,
      hint: `(-${a}) × ${b} × (-${c}) = ${a} × ${b} × ${c} = ${ans}. Hai dấu âm → dương.`,
    };
  } else if (type === 1) {
    const a = randInt(-20, 20);
    return {
      text: `${a} × 0 = ?`,
      answer: 0,
      hint: `Bất kỳ số nào nhân 0 đều bằng 0.`,
    };
  } else {
    const a = randInt(1, 20);
    const sign = pick([-1, 1]);
    const num = sign * a;
    const ans = -num;
    return {
      text: `${num} × (-1) = ?`,
      answer: ans,
      hint: `Nhân với -1 cho số đối: ${num} × (-1) = ${ans}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(1, 12);
    const x = randInt(-12, 12);
    if (x === 0) return generateFindX();
    const product = -a * x;
    return {
      text: `(-${a}) × x = ${product} → x = ?`,
      answer: x,
      hint: `x = ${product} : (-${a}) = ${x}.`,
    };
  } else if (type === 1) {
    const a = randInt(1, 12);
    const x = randInt(-12, 12);
    if (x === 0) return generateFindX();
    const product = x * (-a);
    return {
      text: `x × (-${a}) = ${product} → x = ?`,
      answer: x,
      hint: `x = ${product} : (-${a}) = ${x}.`,
    };
  } else {
    const a = randInt(1, 12);
    const x = randInt(1, 12);
    const product = -a * x;
    return {
      text: `(-${a}) × x = ${product} → x = ?`,
      answer: x,
      hint: `x = ${product} : (-${a}) = ${x}.`,
    };
  }
};

export default function NhanSoNguyenInteractive() {
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
    <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-red-900 mb-4 text-center">
        🧮 Thực hành: Phép nhân số nguyên
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
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-red-600 hover:bg-red-100'
          }`}
        >
          ✖️ Phép nhân
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white text-rose-600 hover:bg-rose-100'
          }`}
        >
          ⚡ Tính nhanh
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-white text-pink-600 hover:bg-pink-100'
          }`}
        >
          🔍 Tìm x
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Phép nhân số nguyên:',
        '#dc2626',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Tính nhanh phép nhân:',
        '#e11d48',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm x trong phương trình nhân:',
        '#db2777',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-red-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-red-800 space-y-1">
          <li>• Cùng dấu → kết quả dương</li>
          <li>• Khác dấu → kết quả âm</li>
          <li>• a × 0 = 0 (bất kỳ số nào × 0 = 0)</li>
          <li>• a × 1 = a (nhân với 1 giữ nguyên)</li>
          <li>• a × (-1) = -a (nhân với -1 lấy số đối)</li>
          <li>• a × b = b × a (tính chất giao hoán)</li>
        </ul>
      </div>
    </div>
  );
}
