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
    const a = randInt(5, 20);
    const b = randInt(5, 20);
    return {
      text: `Chu vi hình chữ nhật dài ${a} cm, rộng ${b} cm là:`,
      answer: 2 * (a + b),
      hint: `Chu vi = 2 × (${a} + ${b}) = ${2 * (a + b)} cm.`,
    };
  } else if (type === 1) {
    const a = randInt(5, 15);
    return {
      text: `Chu vi hình thoi cạnh ${a} cm là:`,
      answer: 4 * a,
      hint: `Chu vi hình thoi = 4 × ${a} = ${4 * a} cm.`,
    };
  } else {
    const a = randInt(5, 15);
    const b = randInt(5, 15);
    return {
      text: `Chu vi hình bình hành cạnh ${a} cm, cạnh ${b} cm là:`,
      answer: 2 * (a + b),
      hint: `Chu vi = 2 × (${a} + ${b}) = ${2 * (a + b)} cm.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(5, 20);
    const b = randInt(5, 20);
    return {
      text: `Diện tích hình chữ nhật ${a} cm × ${b} cm là:`,
      answer: a * b,
      hint: `Diện tích = ${a} × ${b} = ${a * b} cm².`,
    };
  } else if (type === 1) {
    const d1 = randInt(4, 16);
    const d2 = randInt(4, 16);
    return {
      text: `Diện tích hình thoi có d₁ = ${d1} cm, d₂ = ${d2} cm là:`,
      answer: (d1 * d2) / 2,
      hint: `Diện tích = (${d1} × ${d2}) : 2 = ${(d1 * d2) / 2} cm².`,
    };
  } else {
    const a = randInt(5, 20);
    const h = randInt(3, 12);
    return {
      text: `Diện tích hình bình hành đáy ${a} cm, chiều cao ${h} cm là:`,
      answer: a * h,
      hint: `Diện tích = ${a} × ${h} = ${a * h} cm².`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(5, 15);
    const b = randInt(5, 15);
    const perim = 2 * (a + b);
    return {
      text: `Hình chữ nhật có chu vi ${perim} cm và chiều rộng ${b} cm. Chiều dài là:`,
      answer: a,
      hint: `Chu vi = 2 × (dài + rộng) ⇒ dài = ${perim} : 2 - ${b} = ${a} cm.`,
    };
  } else if (type === 1) {
    const a = randInt(3, 12);
    return {
      text: `Hình thoi có chu vi ${4 * a} cm. Độ dài cạnh là:`,
      answer: a,
      hint: `Chu vi hình thoi = 4 × cạnh ⇒ cạnh = ${4 * a} : 4 = ${a} cm.`,
    };
  } else {
    const a = randInt(5, 20);
    const b = randInt(3, 10);
    const perim = a + b + 2 * 5;
    return {
      text: `Hình thang cân có đáy lớn ${a} cm, đáy nhỏ ${b} cm, chu vi ${perim} cm. Cạnh bên là:`,
      answer: 5,
      hint: `Chu vi = ${a} + ${b} + 2 × cạnh bên ⇒ cạnh bên = (${perim} - ${a} - ${b}) : 2 = 5 cm.`,
    };
  }
};

export default function HinhPhang2Interactive() {
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
      <h3 className="text-xl font-bold text-emerald-900 mb-4 text-center">
        🧮 Thực hành: Hình chữ nhật, Thoi, Bình hành, Thang cân
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
          ✏️ Tính chu vi
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-teal-600 hover:bg-teal-100'
          }`}
        >
          ⚡ Tính diện tích
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-white text-cyan-600 hover:bg-cyan-100'
          }`}
        >
          🔍 Tìm cạnh khi biết chu vi
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Tính chu vi các hình tứ giác:',
        '#059669',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Tính diện tích các hình tứ giác:',
        '#0d9488',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm cạnh khi biết chu vi:',
        '#0891b2',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-emerald-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-emerald-800 space-y-1">
          <li>• Hình chữ nhật: P = 2(a+b), S = a×b</li>
          <li>• Hình thoi: P = 4a, S = (d₁×d₂)/2</li>
          <li>• Hình bình hành: P = 2(a+b), S = a×h</li>
          <li>• Hình thang cân: P = a+b+2c, S = (a+b)×h/2</li>
        </ul>
      </div>
    </div>
  );
}
