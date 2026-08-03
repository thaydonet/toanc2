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
  const type = randInt(0, 1);
  if (type === 0) {
    const shapes = [
      { name: 'hình bình hành', has: true },
      { name: 'hình chữ nhật', has: true },
      { name: 'hình thoi', has: true },
      { name: 'hình vuông', has: true },
      { name: 'hình tròn', has: true },
      { name: 'tam giác đều', has: false },
      { name: 'hình thang cân', has: false },
      { name: 'hình ngũ giác đều', has: false },
    ];
    const s = pick(shapes);
    return {
      text: `${s.name} có tâm đối xứng không? (1=Có, 0=Không)`,
      answer: s.has ? 1 : 0,
      hint: s.has
        ? `${s.name} có tâm đối xứng.`
        : `${s.name} không có tâm đối xứng.`,
    };
  } else {
    const shapes = [
      { name: 'đoạn thẳng', center: 'trung điểm' },
      { name: 'hình tròn', center: 'tâm của hình tròn' },
      { name: 'hình bình hành', center: 'giao điểm hai đường chéo' },
      { name: 'hình chữ nhật', center: 'giao điểm hai đường chéo' },
      { name: 'hình thoi', center: 'giao điểm hai đường chéo' },
      { name: 'hình vuông', center: 'giao điểm hai đường chéo' },
    ];
    const s = pick(shapes);
    return {
      text: `Tâm đối xứng của ${s.name} là gì? (1=${s.center}, 0=Không có)`,
      answer: 1,
      hint: `Tâm đối xứng của ${s.name} là ${s.center}.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    return {
      text: `Khi quay hình 180° quanh tâm đối xứng, hình sẽ: (1=Trùng khít, 0=Không trùng)`,
      answer: 1,
      hint: `Định nghĩa tâm đối xứng: quay 180° quanh tâm thì hình trùng khít.`,
    };
  } else {
    const letters = pick(['S', 'N', 'O', 'Z', 'H', 'A', 'M', 'X']);
    const hasCenter = ['S', 'N', 'O', 'Z'].includes(letters);
    return {
      text: `Chữ "${letters}" có tâm đối xứng không? (1=Có, 0=Không)`,
      answer: hasCenter ? 1 : 0,
      hint: hasCenter
        ? `Chữ ${letters} có tâm đối xứng.`
        : `Chữ ${letters} không có tâm đối xứng.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    return {
      text: `Hình nào vừa có trục đối xứng vừa có tâm đối xứng? (1=Hình vuông, 0=Hình thang cân)`,
      answer: 1,
      hint: `Hình vuông có 4 trục đối xứng + tâm đối xứng. Hình thang cân chỉ có 1 trục, không có tâm.`,
    };
  } else {
    return {
      text: `Hình nào có tâm đối xứng nhưng không có trục đối xứng? (1=Hình bình hành thường, 0=Hình thoi)`,
      answer: 1,
      hint: `Hình bình hành thường có tâm đối xứng (giao điểm 2 đường chéo) nhưng không có trục đối xứng.`,
    };
  }
};

export default function TamDoiXungInteractive() {
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
    <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-sky-900 mb-4 text-center">
        🧮 Thực hành: Hình có tâm đối xứng
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
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white text-sky-600 hover:bg-sky-100'
          }`}
        >
          ✏️ Hình có tâm đối xứng
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          ⚡ Chữ cái & Kiến thức
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-indigo-600 hover:bg-indigo-100'
          }`}
        >
          🔍 So sánh trục & tâm
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Xác định hình có tâm đối xứng:',
        '#0284c7',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Chữ cái và kiến thức tâm đối xứng:',
        '#2563eb',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'So sánh trục đối xứng và tâm đối xứng:',
        '#4f46e5',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-sky-900 font-medium mb-2">💡 Ghi nhớ nhanh:</p>
        <ul className="text-sm text-sky-800 space-y-1">
          <li>• Tâm đối xứng: quay 180° quanh điểm đó, hình trùng khít</li>
          <li>• Có tâm: đoạn thẳng, hình tròn, bình hành, chữ nhật, thoi, vuông, lục giác đều</li>
          <li>• Không có tâm: tam giác (kể cả đều), thang cân, ngũ giác đều</li>
          <li>• Khi có cả hai, tâm đối xứng luôn nằm trên mỗi trục đối xứng</li>
        </ul>
      </div>
    </div>
  );
}
