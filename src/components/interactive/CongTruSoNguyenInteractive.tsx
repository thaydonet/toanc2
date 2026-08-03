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
    const a = randInt(-20, 20);
    const b = randInt(-20, 20);
    return {
      text: `${a} + (${b}) = ?`,
      answer: a + b,
      hint: `Phép cộng số nguyên: ${a} + ${b >= 0 ? '' : '('}${b}${b >= 0 ? '' : ')'} = ${a + b}.`,
    };
  } else if (type === 1) {
    const a = randInt(-20, 20);
    const b = randInt(-20, 20);
    return {
      text: `${a} - (${b}) = ?`,
      answer: a - b,
      hint: `Phép trừ số nguyên: ${a} - ${b >= 0 ? '' : '('}${b}${b >= 0 ? '' : ')'} = ${a - b}.`,
    };
  } else {
    const a = randInt(-20, 20);
    const b = randInt(-20, 20);
    const ans = b - a;
    return {
      text: `Tìm x sao cho x + (${a}) = ${b}`,
      answer: ans,
      hint: `x = ${b} - (${a}) = ${b} + ${-a} = ${ans}.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(1, 15);
    const b = randInt(1, 15);
    return {
      text: `(-${a}) + (-${b}) = ?`,
      answer: -(a + b),
      hint: `(-${a}) + (-${b}) = -(${a} + ${b}) = ${-(a + b)}.`,
    };
  } else if (type === 1) {
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    return {
      text: `${a} - ${b} = ?`,
      answer: a - b,
      hint: `${a} - ${b} = ${a - b}.`,
    };
  } else {
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    const x = b - a;
    return {
      text: `x + (${a}) = ${b}, tìm x`,
      answer: x,
      hint: `x = ${b} - (${a}) = ${x}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    const ans = b - a;
    return {
      text: `x + (${a}) = ${b} → x = ?`,
      answer: ans,
      hint: `x = ${b} - (${a}) = ${ans}.`,
    };
  } else {
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    const ans = a - b;
    return {
      text: `${a} - x = ${b} → x = ?`,
      answer: ans,
      hint: `x = ${a} - ${b} = ${ans}.`,
    };
  }
};

export default function CongTruSoNguyenInteractive() {
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
    <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-teal-900 mb-4 text-center">
        🧮 Thực hành: Phép cộng và trừ số nguyên
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
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-emerald-600 hover:bg-emerald-100'
          }`}
        >
          ➕ Phép cộng/trừ
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-teal-600 hover:bg-teal-100'
          }`}
        >
          ⚡ Tính nhanh
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-green-600 text white shadow-md'
              : 'bg-white text-green-600 hover:bg-green-100'
          }`}
        >
          🔍 Tìm x
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Phép cộng và trừ số nguyên:',
        '#059669',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Tính nhanh:',
        '#0d9488',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm x trong phương trình:',
        '#16a34a',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-teal-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-teal-800 space-y-1">
          <li>• Cộng số nguyên: cùng dấu cộng, khác dấu trừ rồi lấy dấu của số lớn hơn</li>
          <li>• Trừ số nguyên: đổi dấu số bị trừ rồi thực hiện phép cộng</li>
          <li>• a + b = b + a (tính chất giao hoán)</li>
          <li>• (a + b) + c = a + (b + c) (tính chất kết hợp)</li>
        </ul>
      </div>
    </div>
  );
}
