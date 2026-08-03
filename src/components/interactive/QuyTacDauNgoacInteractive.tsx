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
    const a = randInt(1, 20);
    const b = randInt(1, 15);
    const c = randInt(1, 10);
    const ans = a + b - c;
    return {
      text: `${a} + (${b} - ${c})`,
      answer: ans,
      hint: `Bước ngoặc: ${a} + ${b} - ${c} = ${ans}. Trước ngoặc là dấu + nên giữ nguyên.`,
    };
  } else if (type === 1) {
    const a = randInt(10, 30);
    const b = randInt(1, 15);
    const c = randInt(1, 10);
    const ans = a - b - c;
    return {
      text: `${a} - (${b} + ${c})`,
      answer: ans,
      hint: `Bước ngoặc: ${a} - ${b} - ${c} = ${ans}. Trước ngoặc là dấu - nên đổi dấu bên trong.`,
    };
  } else {
    const a = randInt(10, 30);
    const b = randInt(1, 15);
    const c = randInt(1, 10);
    const ans = a - b + c;
    return {
      text: `${a} - (${b} - ${c})`,
      answer: ans,
      hint: `Bước ngoặc: ${a} - ${b} + ${c} = ${ans}. Trước ngoặc là dấu - nên đổi dấu bên trong.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(10, 40);
    const b = randInt(1, 10);
    const c = randInt(1, 10);
    const ans = a - b + c;
    return {
      text: `${a} - (${b} - ${c}) = ?`,
      answer: ans,
      hint: `${a} - (${b} - ${c}) = ${a} - ${b} + ${c} = ${ans}.`,
    };
  } else if (type === 1) {
    const a = randInt(10, 20);
    const b = randInt(1, 8);
    const c = randInt(1, 5);
    const inner = -(b + c);
    const ans = -a + inner;
    return {
      text: `(-${a}) - (${b} + ${c}) = ?`,
      answer: ans,
      hint: `(-${a}) - ${b} - ${c} = ${ans}. Đổi dấu ${b} và ${c}.`,
    };
  } else {
    const a = randInt(50, 200);
    const b = randInt(10, 30);
    const c = randInt(10, 20);
    const ans = a - b + c;
    return {
      text: `${a} - (${b} - ${c}) = ?`,
      answer: ans,
      hint: `${a} - ${b} + ${c} = ${ans}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const b = randInt(1, 8);
    const c = randInt(1, 6);
    const x = randInt(1, 15);
    const target = x + b - c;
    return {
      text: `x + (${b} - ${c}) = ${target} → x = ?`,
      answer: x,
      hint: `x + ${b} - ${c} = ${target} → x = ${target} - ${b} + ${c} = ${x}.`,
    };
  } else if (type === 1) {
    const target = randInt(-10, 10);
    const a = randInt(10, 30);
    const c = randInt(1, 8);
    const x = a - target + c;
    return {
      text: `${a} - (x - ${c}) = ${target} → x = ?`,
      answer: x,
      hint: `${a} - x + ${c} = ${target} → x = ${a} + ${c} - ${target} = ${x}.`,
    };
  } else {
    const a = randInt(10, 30);
    const target = randInt(1, 10);
    const x = randInt(1, 10);
    const b = target + x - a + x;
    return {
      text: `${a} - (x + ${x}) = ${target} → x = ?`,
      answer: x,
      hint: `${a} - x - ${x} = ${target} → x = ${a} - ${x} - ${target} = ${x}.`,
    };
  }
};

export default function QuyTacDauNgoacInteractive() {
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
    <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">
        🧮 Thực hành: Quy tắc dấu ngoặc
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
          📝 Bước ngoặc
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-yellow-600 text-white shadow-md'
              : 'bg-white text-yellow-600 hover:bg-yellow-100'
          }`}
        >
          ⚡ Tính nhanh
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white text-orange-600 hover:bg-orange-100'
          }`}
        >
          🔍 Tìm x
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Bước ngoặc (quy tắc dấu ngoặc):',
        '#d97706',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Tính nhanh biểu thức có ngoặc:',
        '#ca8a04',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm x trong biểu thức có ngoặc:',
        '#ea580c',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-amber-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Trước ngoặc là dấu +: giữ nguyên dấu bên trong ngoặc</li>
          <li>• Trước ngoặc là dấu -: đổi dấu tất cả bên trong ngoặc</li>
          <li>• a + (b - c) = a + b - c</li>
          <li>• a - (b + c) = a - b - c</li>
          <li>• a - (b - c) = a - b + c</li>
        </ul>
      </div>
    </div>
  );
}
