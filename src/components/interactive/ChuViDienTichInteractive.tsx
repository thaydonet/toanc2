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
      text: `Diện tích hình chữ nhật ${a} cm × ${b} cm là:`,
      answer: a * b,
      hint: `S = ${a} × ${b} = ${a * b} cm².`,
    };
  } else if (type === 1) {
    const a = randInt(3, 12);
    return {
      text: `Diện tích hình vuông cạnh ${a} cm là:`,
      answer: a * a,
      hint: `S = ${a}² = ${a * a} cm².`,
    };
  } else {
    const d1 = randInt(4, 16);
    const d2 = randInt(4, 16);
    return {
      text: `Diện tích hình thoi d₁=${d1} cm, d₂=${d2} cm là:`,
      answer: (d1 * d2) / 2,
      hint: `S = (${d1} × ${d2}) : 2 = ${(d1 * d2) / 2} cm².`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(5, 20);
    const h = randInt(3, 12);
    return {
      text: `Diện tích hình bình hành đáy ${a} cm, cao ${h} cm là:`,
      answer: a * h,
      hint: `S = ${a} × ${h} = ${a * h} cm².`,
    };
  } else if (type === 1) {
    const a = randInt(8, 20);
    const b = randInt(4, 12);
    const h = randInt(3, 10);
    return {
      text: `Diện tích hình thang đáy lớn ${a} cm, đáy nhỏ ${b} cm, cao ${h} cm là:`,
      answer: ((a + b) * h) / 2,
      hint: `S = (${a} + ${b}) × ${h} : 2 = ${((a + b) * h) / 2} cm².`,
    };
  } else {
    const a = randInt(5, 15);
    return {
      text: `Diện tích hình tròn bán kính ${a} cm (π≈3,14) là:`,
      answer: Math.round(3.14 * a * a * 100) / 100,
      hint: `S = π × ${a}² ≈ 3,14 × ${a * a} = ${(3.14 * a * a).toFixed(2)} cm².`,
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
      text: `Hình chữ nhật có chu vi ${perim} cm, chiều rộng ${b} cm. Chiều dài là:`,
      answer: a,
      hint: `Chu vi = 2(dài + rộng) ⇒ dài = ${perim}:2 - ${b} = ${a} cm.`,
    };
  } else if (type === 1) {
    const a = randInt(5, 15);
    const h = randInt(3, 10);
    const area = a * h;
    return {
      text: `Hình bình hành diện tích ${area} cm², chiều cao ${h} cm. Đáy là:`,
      answer: a,
      hint: `S = đáy × cao ⇒ đáy = ${area} : ${h} = ${a} cm.`,
    };
  } else {
    const a = randInt(5, 12);
    return {
      text: `Diện tích hình vuông là ${a * a} cm². Độ dài cạnh là:`,
      answer: a,
      hint: `S = cạnh² ⇒ cạnh = √${a * a} = ${a} cm.`,
    };
  }
};

export default function ChuViDienTichInteractive() {
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
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">
        🧮 Thực hành: Chu vi và diện tích các hình
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
          ✏️ Diện tích hình chữ nhật, vuông, thoi
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white text-orange-600 hover:bg-orange-100'
          }`}
        >
          ⚡ Diện tích bình hành, thang, tròn
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-red-600 hover:bg-red-100'
          }`}
        >
          🔍 Tìm cạnh khi biết diện tích
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Tính diện tích hình chữ nhật, vuông, thoi:',
        '#d97706',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Tính diện tích hình bình hành, thang, tròn:',
        '#ea580c',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm cạnh khi biết diện tích:',
        '#dc2626',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-amber-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Hình chữ nhật: P = 2(a+b), S = a×b</li>
          <li>• Hình vuông: P = 4a, S = a²</li>
          <li>• Hình thoi: P = 4a, S = (d₁×d₂)/2</li>
          <li>• Hình bình hành: P = 2(a+b), S = đáy×cao</li>
          <li>• Hình thang: P = a+b+2c, S = (a+b)×h/2</li>
          <li>• Hình tròn: C = 2πr, S = πr²</li>
        </ul>
      </div>
    </div>
  );
}
