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

const shapes = [
  { name: 'tam giác đều', axes: 3 },
  { name: 'hình vuông', axes: 4 },
  { name: 'hình chữ nhật', axes: 2 },
  { name: 'hình thoi', axes: 2 },
  { name: 'hình tròn', axes: -1 },
  { name: 'hình lục giác đều', axes: 6 },
  { name: 'hình thang cân', axes: 1 },
];

const generatePractice = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const s = pick(shapes);
    return {
      text: `${s.name} có bao nhiêu trục đối xứng? (-1 = vô số)`,
      answer: s.axes,
      hint: `${s.name} có ${s.axes === -1 ? 'vô số' : s.axes} trục đối xứng.`,
    };
  } else {
    const letter = pick(['A', 'H', 'E', 'O', 'M', 'N', 'B', 'D', 'I', 'X', 'Y']);
    const hasAxis = ['A', 'H', 'E', 'O', 'I', 'X', 'Y'].includes(letter);
    return {
      text: `Chữ "${letter}" có trục đối xứng không? (1=Có, 0=Không)`,
      answer: hasAxis ? 1 : 0,
      hint: hasAxis
        ? `Chữ ${letter} có trục đối xứng.`
        : `Chữ ${letter} không có trục đối xứng.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    const nums = pick(['0', '8', '3', '1', '2', '4', '5', '6', '7', '9']);
    const hasAxis = ['0', '8', '3'].includes(nums);
    return {
      text: `Số "${nums}" có trục đối xứng không? (1=Có, 0=Không)`,
      answer: hasAxis ? 1 : 0,
      hint: hasAxis
        ? `Số ${nums} có trục đối xứng.`
        : `Số ${nums} không có trục đối xứng.`,
    };
  } else {
    const pairs = [
      { shapes: 'Hình vuông', axes: 4 },
      { shapes: 'Hình chữ nhật', axes: 2 },
      { shapes: 'Tam giác đều', axes: 3 },
      { shapes: 'Hình thoi', axes: 2 },
      { shapes: 'Hình thang cân', axes: 1 },
      { shapes: 'Lục giác đều', axes: 6 },
    ];
    const s = pick(pairs);
    return {
      text: `Hình nào có ${s.axes} trục đối xứng? (1=${s.shapes}, 0=Không phải)`,
      answer: 1,
      hint: `${s.shapes} có ${s.axes} trục đối xứng.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    return {
      text: `Khi gập hình theo trục đối xứng, hai phần sẽ: (1=Chồng khít, 0=Không chồng khít)`,
      answer: 1,
      hint: `Định nghĩa trục đối xứng: gập theo trục thì hai phần chồng khít.`,
    };
  } else {
    return {
      text: `Đường thẳng nào sau đây là trục đối xứng của hình chữ nhật? (1=Đường qua trung điểm cạnh đối, 0=Đường chéo)`,
      answer: 1,
      hint: `Hình chữ nhật có 2 trục: đường qua trung điểm 2 cặp cạnh đối. Đường chéo KHÔNG phải trục đối xứng (trừ hình vuông).`,
    };
  }
};

export default function TrucDoiXungInteractive() {
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
    <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-rose-900 mb-4 text-center">
        🧮 Thực hành: Hình có trục đối xứng
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
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white text-rose-600 hover:bg-rose-100'
          }`}
        >
          ✏️ Số trục đối xứng
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-white text-pink-600 hover:bg-pink-100'
          }`}
        >
          ⚡ Chữ cái & Số có trục
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-fuchsia-600 text-white shadow-md'
              : 'bg-white text-fuchsia-600 hover:bg-fuchsia-100'
          }`}
        >
          🔍 Kiến thức trục đối xứng
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Xác định số trục đối xứng của hình:',
        '#e11d48',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Chữ cái và số có trục đối xứng:',
        '#db2777',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Kiến thức về trục đối xứng:',
        '#a21caf',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-rose-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-rose-800 space-y-1">
          <li>• Trục đối xứng: đường thẳng mà khi gập hình theo đó, hai phần chồng khít</li>
          <li>• Tam giác đều: 3 trục | Hình vuông: 4 trục | Hình chữ nhật: 2 trục</li>
          <li>• Hình thoi: 2 trục | Hình thang cân: 1 trục | Lục giác đều: 6 trục</li>
          <li>• Hình tròn: vô số trục (mọi đường kính)</li>
        </ul>
      </div>
    </div>
  );
}
