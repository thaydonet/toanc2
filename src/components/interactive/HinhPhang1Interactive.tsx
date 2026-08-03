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
    const sides = pick([3, 4, 6]);
    const names: Record<number, string> = { 3: 'tam giác đều', 4: 'hình vuông', 6: 'lục giác đều' };
    const angles: Record<number, number> = { 3: 60, 4: 90, 6: 120 };
    return {
      text: `${names[sides]} có bao nhiêu cạnh bằng nhau?`,
      answer: sides,
      hint: `${names[sides]} có ${sides} cạnh bằng nhau.`,
    };
  } else if (type === 1) {
    const a = randInt(2, 15);
    const shape = pick(['tam giác đều', 'hình vuông', 'lục giác đều']);
    const perimMult: Record<string, number> = { 'tam giác đều': 3, 'hình vuông': 4, 'lục giác đều': 6 };
    return {
      text: `Chu vi ${shape} cạnh ${a} cm là bao nhiêu cm?`,
      answer: perimMult[shape] * a,
      hint: `Chu vi ${shape} = ${perimMult[shape]} × ${a} = ${perimMult[shape] * a} cm.`,
    };
  } else {
    const a = randInt(2, 10);
    return {
      text: `Diện tích hình vuông cạnh ${a} cm là bao nhiêu cm²?`,
      answer: a * a,
      hint: `Diện tích hình vuông = ${a} × ${a} = ${a * a} cm².`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(3, 12);
    return {
      text: `Mỗi góc của hình vuông bằng bao nhiêu độ?`,
      answer: 90,
      hint: `Hình vuông có 4 góc vuông, mỗi góc = 90°.`,
    };
  } else if (type === 1) {
    const a = randInt(3, 12);
    return {
      text: `Mỗi góc của tam giác đều bằng bao nhiêu độ?`,
      answer: 60,
      hint: `Tam giác đều có 3 góc bằng nhau, mỗi góc = 60°.`,
    };
  } else {
    const a = randInt(3, 12);
    return {
      text: `Mỗi góc của lục giác đều bằng bao nhiêu độ?`,
      answer: 120,
      hint: `Lục giác đều có 6 góc bằng nhau, mỗi góc = 120°.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(4, 15);
    return {
      text: `Cho hình vuông có chu vi ${4 * a} cm. Độ dài cạnh là:`,
      answer: a,
      hint: `Chu vi hình vuông = 4 × cạnh ⇒ cạnh = ${4 * a} : 4 = ${a} cm.`,
    };
  } else if (type === 1) {
    const a = randInt(4, 15);
    return {
      text: `Cho tam giác đều có chu vi ${3 * a} cm. Độ dài cạnh là:`,
      answer: a,
      hint: `Chu vi tam giác đều = 3 × cạnh ⇒ cạnh = ${3 * a} : 3 = ${a} cm.`,
    };
  } else {
    const a = randInt(4, 15);
    return {
      text: `Cho lục giác đều có chu vi ${6 * a} cm. Độ dài cạnh là:`,
      answer: a,
      hint: `Chu vi lục giác đều = 6 × cạnh ⇒ cạnh = ${6 * a} : 6 = ${a} cm.`,
    };
  }
};

export default function HinhPhang1Interactive() {
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
        🧮 Thực hành: Hình đều — Tam giác đều, Hình vuông, Lục giác đều
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
          ✏️ Nhận biết & Chu vi
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-fuchsia-600 text-white shadow-md'
              : 'bg-white text-fuchsia-600 hover:bg-fuchsia-100'
          }`}
        >
          ⚡ Góc của hình đều
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-indigo-600 hover:bg-indigo-100'
          }`}
        >
          🔍 Tìm cạnh từ chu vi
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Nhận biết hình đều và tính chu vi:',
        '#7c3aed',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Mỗi góc của hình đều bằng bao nhiêu độ?',
        '#c026d3',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm cạnh khi biết chu vi:',
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
          <li>• Tam giác đều: 3 cạnh bằng nhau, 3 góc 60°, chu vi P = 3a</li>
          <li>• Hình vuông: 4 cạnh bằng nhau, 4 góc 90°, chu vi P = 4a, diện tích S = a²</li>
          <li>• Lục giác đều: 6 cạnh bằng nhau, 6 góc 120°, chu vi P = 6a</li>
        </ul>
      </div>
    </div>
  );
}
