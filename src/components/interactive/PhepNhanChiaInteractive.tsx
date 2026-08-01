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

const generatePractice = (): Problem => {
  if (Math.random() > 0.5) {
    const a = randInt(6, 25);
    const b = randInt(3, 9);
    return { text: `${a} × ${b}`, answer: a * b };
  } else {
    const b = randInt(3, 12);
    const q = randInt(4, 15);
    const a = b * q;
    return { text: `${a} : ${b}`, answer: q, hint: 'Đây là phép chia hết.' };
  }
};

const generateQuick = (): Problem => {
  const techniques = [
    () => {
      const a = randInt(2, 9);
      const b = [4, 8, 25, 125][randInt(0, 3)];
      return { text: `${a} × ${b} × ${Math.round(100 / (b === 25 ? 4 : b === 125 ? 8 : 1))}`, answer: a * b * Math.round(100 / (b === 25 ? 4 : b === 125 ? 8 : 1)), hint: `Nhóm ${b} × ${Math.round(100 / (b === 25 ? 4 : b === 125 ? 8 : 1))} = 100.` };
    },
    () => {
      const a = randInt(2, 9);
      return { text: `${a} × 99`, answer: a * 99, hint: `${a} × 99 = ${a} × (100 - 1).` };
    },
    () => {
      const a = randInt(4, 20);
      const b = randInt(4, 20);
      const c = randInt(3, 10);
      const aq = Math.floor(a / c) * c;
      const bq = Math.floor(b / c) * c;
      return { text: `(${aq} + ${bq}) : ${c}`, answer: (aq + bq) / c, hint: `Chia từng số hạng: ${aq} : ${c} + ${bq} : ${c}.` };
    },
  ];
  return techniques[randInt(0, techniques.length - 1)]();
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(3, 12);
    const b = randInt(4, 12);
    return {
      text: `x × ${a} = ${a * b}`,
      answer: b,
      hint: `x = ${a * b} : ${a}.`,
    };
  } else if (type === 1) {
    const a = randInt(3, 12);
    const b = randInt(5, 15);
    return {
      text: `x : ${a} = ${b}`,
      answer: a * b,
      hint: `x = ${b} × ${a}.`,
    };
  } else {
    const a = randInt(3, 12);
    const b = randInt(4, 12);
    return {
      text: `${a * b} : x = ${b}`,
      answer: a,
      hint: `x = ${a * b} : ${b}.`,
    };
  }
};

export default function PhepNhanChiaInteractive() {
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
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-indigo-800 mb-4 text-center">
        🧮 Thực hành: Phép nhân và phép chia
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
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-indigo-600 hover:bg-indigo-100'
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
        'Thực hiện phép tính:',
        '#4f46e5',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Tính nhanh (vận dụng tính chất):',
        '#16a34a',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm số chưa biết:',
        '#7c3aed',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-indigo-800 font-medium mb-2">💡 Ghi nhớ:</p>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>• Phép nhân có: giao hoán, kết hợp, nhân với 1, phân phối với phép cộng</li>
          <li>• Tính nhanh: nhóm thừa số tròn trăm như 25 × 4 = 100, 125 × 8 = 1000</li>
          <li>• Nếu a × b = c thì c : a = b và c : b = a</li>
        </ul>
      </div>
    </div>
  );
}
